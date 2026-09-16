import AsyncStorage from '@react-native-async-storage/async-storage';
import { NBAPlayer, MarketItem, DailyMarketState, UserCard } from '../types';
import { ACTIVE_NBA_PLAYERS } from '../data/nbaPlayers';
import { ALL_ICON_PLAYERS } from '../data/classicTeams';

const MARKET_STORAGE_KEY = '@nba_market_state_v7_curated_lowtier';
const ROTATION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours

/**
 * Dynamic pricing algorithm:
 * - Exponential curve based on OVR.
 * - Multiplier for ICON / Classic Legends.
 */
export const calculatePlayerPrice = (
  player: NBAPlayer
): { price: number; originalPrice?: number; discountPct?: number } => {
  const ovr = player.stats.ovr;
  const isIcon = player.rarity === 'ICON' || player.isLegend;

  let base = 100;
  if (ovr <= 74) {
    base = 80 + (ovr - 70) * 20; // 80 - 160
  } else if (ovr <= 79) {
    base = 180 + (ovr - 75) * 35; // 180 - 320
  } else if (ovr <= 84) {
    base = 350 + (ovr - 80) * 90; // 350 - 710
  } else if (ovr <= 89) {
    base = 800 + (ovr - 85) * 220; // 800 - 1,680
  } else if (ovr <= 93) {
    base = 2000 + (ovr - 90) * 550; // 2,000 - 3,650
  } else {
    base = 4500;
  }

  let finalPrice = base;

  // Icon multiplier for low-tier legends
  if (isIcon) {
    if (ovr <= 91) {
      finalPrice = Math.round(base * 2.1); // ~4,200 - 5,500
    } else {
      finalPrice = Math.round(base * 2.3); // ~6,500 - 7,500
    }
  }

  // Clean rounding to nearest multiple of 50
  finalPrice = Math.round(finalPrice / 50) * 50;
  return { price: finalPrice };
};

/**
 * Generate a curated, balanced batch of 6 daily transfer market cards (strictly < 94 OVR):
 * - 1x Low-tier ICON / Classic Legend (OVR 90 - 92)
 * - 1x Low-tier DIAMOND (OVR 90 - 93, e.g. Adebayo, Trae Young, Banchero)
 * - 2x GOLD (OVR 84 - 89, e.g. Murray, Holiday, White)
 * - 1x SILVER (OVR 79 - 83)
 * - 1x BRONZE (OVR 70 - 78)
 * (Cards >= 94 OVR are exclusive to Pack openings)
 */
export const generateDailyMarketBatch = (seedTime: number): MarketItem[] => {
  const selected: NBAPlayer[] = [];
  const usedIds = new Set<string>();

  // 1. Pick 1 Low-Tier Icon (OVR 90 - 92, strictly < 94)
  const lowIcons = ALL_ICON_PLAYERS.filter(
    (p) => p.stats.ovr >= 90 && p.stats.ovr <= 92
  ).sort(() => Math.random() - 0.5);
  if (lowIcons.length > 0) {
    selected.push(lowIcons[0]);
    usedIds.add(lowIcons[0].id);
  }

  // 2. Pick 1 Low-Tier Diamond (OVR 90 - 93, strictly < 94)
  const lowDiamonds = ACTIVE_NBA_PLAYERS.filter(
    (p) =>
      p.stats.ovr >= 90 &&
      p.stats.ovr <= 93 &&
      !usedIds.has(p.id)
  ).sort(() => Math.random() - 0.5);
  if (lowDiamonds.length > 0) {
    selected.push(lowDiamonds[0]);
    usedIds.add(lowDiamonds[0].id);
  }

  // 3. Pick 2 Golds (OVR 84 - 89)
  const golds = ACTIVE_NBA_PLAYERS.filter(
    (p) => p.stats.ovr >= 84 && p.stats.ovr <= 89 && !usedIds.has(p.id)
  ).sort(() => Math.random() - 0.5);
  for (let i = 0; i < 2 && i < golds.length; i++) {
    if (!usedIds.has(golds[i].id)) {
      selected.push(golds[i]);
      usedIds.add(golds[i].id);
    }
  }

  // 4. Pick 1 Silver (OVR 79 - 83)
  const silvers = ACTIVE_NBA_PLAYERS.filter(
    (p) => p.stats.ovr >= 79 && p.stats.ovr <= 83 && !usedIds.has(p.id)
  ).sort(() => Math.random() - 0.5);
  if (silvers.length > 0) {
    selected.push(silvers[0]);
    usedIds.add(silvers[0].id);
  }

  // 5. Pick 1 Bronze (OVR 70 - 78)
  const bronzes = ACTIVE_NBA_PLAYERS.filter(
    (p) => p.stats.ovr <= 78 && !usedIds.has(p.id)
  ).sort(() => Math.random() - 0.5);
  if (bronzes.length > 0) {
    selected.push(bronzes[0]);
    usedIds.add(bronzes[0].id);
  }

  // 1 random card gets a Daily Deal Discount (-20%)
  const dailyDealIndex = Math.floor(Math.random() * selected.length);

  return selected.map((player, idx) => {
    const { price } = calculatePlayerPrice(player);
    const isDailyDeal = idx === dailyDealIndex;

    let finalPrice = price;
    let originalPrice: number | undefined = undefined;
    let discountPct: number | undefined = undefined;

    if (isDailyDeal) {
      originalPrice = price;
      discountPct = 20;
      finalPrice = Math.round((price * 0.8) / 50) * 50;
    }

    return {
      id: `market_${seedTime}_${player.id}_${idx}`,
      player,
      price: finalPrice,
      originalPrice,
      discountPct,
      isDailyDeal,
      isSold: false,
    };
  });
};

export const MarketService = {
  /**
   * Get current daily market or generate fresh 24h batch if expired
   */
  getDailyMarket: async (): Promise<DailyMarketState> => {
    try {
      const stored = await AsyncStorage.getItem(MARKET_STORAGE_KEY);
      const now = Date.now();

      if (stored) {
        const parsed: DailyMarketState = JSON.parse(stored);
        // Check if current 24-hour cycle is still valid
        if (parsed.expiresAt && now < parsed.expiresAt && parsed.items && parsed.items.length > 0) {
          return parsed;
        }
      }

      // Generate new 24h market
      const lastRotationTimestamp = now;
      const expiresAt = now + ROTATION_DURATION_MS;
      const items = generateDailyMarketBatch(lastRotationTimestamp);

      const newState: DailyMarketState = {
        lastRotationTimestamp,
        expiresAt,
        items,
      };

      await AsyncStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    } catch (e) {
      console.error('Failed to get daily market:', e);
      const now = Date.now();
      return {
        lastRotationTimestamp: now,
        expiresAt: now + ROTATION_DURATION_MS,
        items: generateDailyMarketBatch(now),
      };
    }
  },

  /**
   * Mark a market item as sold and persist
   */
  buyMarketItem: async (itemId: string): Promise<DailyMarketState | null> => {
    try {
      const current = await MarketService.getDailyMarket();
      const updatedItems = current.items.map((item) =>
        item.id === itemId ? { ...item, isSold: true } : item
      );

      const updatedState: DailyMarketState = {
        ...current,
        items: updatedItems,
      };

      await AsyncStorage.setItem(MARKET_STORAGE_KEY, JSON.stringify(updatedState));
      return updatedState;
    } catch (e) {
      console.error('Failed to buy market item:', e);
      return null;
    }
  },

  /**
   * Helper to create UserCard from a bought NBAPlayer
   */
  createCardFromPlayer: (player: NBAPlayer): UserCard => {
    return {
      instanceId: `card_${Date.now()}_${Math.random().toString(36).substr(2, 6)}_${player.id}`,
      playerId: player.id,
      player,
      obtainedAt: new Date().toISOString(),
      gamesPlayed: 0,
    };
  },
};
