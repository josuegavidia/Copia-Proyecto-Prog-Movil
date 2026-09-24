import { CardRarity, NBAPlayer, PackDefinition, UserCard } from '../types';
import { NBA_PLAYERS_DATA } from '../data/nbaPlayers';

const RARITY_HIERARCHY: Record<CardRarity, number> = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  DIAMOND: 4,
  ICON: 5,
};

const pickRarity = (chances: PackDefinition['rarityChances']): CardRarity => {
  const rand = Math.random();
  let cumulative = 0;

  if (chances.icon) {
    cumulative += chances.icon;
    if (rand < cumulative) return 'ICON';
  }

  cumulative += chances.diamond;
  if (rand < cumulative) return 'DIAMOND';

  cumulative += chances.gold;
  if (rand < cumulative) return 'GOLD';

  cumulative += chances.silver;
  if (rand < cumulative) return 'SILVER';

  return 'BRONZE';
};

export const openPack = (pack: PackDefinition): UserCard[] => {
  const selectedCards: NBAPlayer[] = [];
  const chosenIds = new Set<string>();

  // Filter pool by conference if specified (e.g. Eastern or Western conference pack)
  const basePool = pack.conferenceOnly
    ? NBA_PLAYERS_DATA.filter((p) => p.conference === pack.conferenceOnly)
    : NBA_PLAYERS_DATA;

  for (let i = 0; i < pack.cardCount; i++) {
    let desiredRarity = pickRarity(pack.rarityChances);

    // Apply guaranteed minimum rarity on the final card
    if (i === pack.cardCount - 1) {
      const minHierarchy = RARITY_HIERARCHY[pack.guaranteedMinRarity];
      if (RARITY_HIERARCHY[desiredRarity] < minHierarchy) {
        desiredRarity = pack.guaranteedMinRarity;
      }
    }

    // Filter available pool
    let pool = basePool.filter(
      (p) => p.rarity === desiredRarity && !chosenIds.has(p.id)
    );

    // Fallback if unique pool of desired rarity is exhausted
    if (pool.length === 0) {
      pool = basePool.filter((p) => p.rarity === desiredRarity);
    }
    if (pool.length === 0) {
      pool = basePool;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosenPlayer = pool[randomIndex];

    chosenIds.add(chosenPlayer.id);
    selectedCards.push(chosenPlayer);
  }

  // Sort cards strictly ascending by OVR so lower OVR appears first and the best/highest OVR card is revealed at the very end!
  selectedCards.sort((a, b) => {
    if (a.stats.ovr !== b.stats.ovr) {
      return a.stats.ovr - b.stats.ovr;
    }
    return RARITY_HIERARCHY[a.rarity] - RARITY_HIERARCHY[b.rarity];
  });

  const timestamp = Date.now();
  return selectedCards.map((player, idx) => ({
    instanceId: `${player.id}-${timestamp}-${Math.random().toString(36).substr(2, 9)}-${idx}`,
    playerId: player.id,
    player,
    obtainedAt: new Date().toISOString(),
  }));
};

export const openStarterTeamPack = (teamAbbr: string): UserCard[] => {
  const cleanAbbr = teamAbbr.toUpperCase().trim();
  const teamPlayers = NBA_PLAYERS_DATA.filter(
    (p) => p.teamAbbr?.toUpperCase() === cleanAbbr || p.team?.toLowerCase().includes(cleanAbbr.toLowerCase())
  );

  const pool = teamPlayers.length > 0 ? teamPlayers : NBA_PLAYERS_DATA;
  const selectedCards: NBAPlayer[] = [];
  const chosenIds = new Set<string>();

  // Probabilidades de sobre inicial: Mayoritariamente bronce y plata, muy baja probabilidad de oro y diamante
  const chances = {
    bronze: 0.65,
    silver: 0.28,
    gold: 0.06,
    diamond: 0.01,
  };

  for (let i = 0; i < 3; i++) {
    const desiredRarity = pickRarity(chances);

    // Buscar jugador con esa rareza en el equipo
    let candidates = pool.filter(
      (p) => p.rarity === desiredRarity && !chosenIds.has(p.id)
    );

    // Si no hay de esa rareza, tomar de cualquier rareza no elegida aún de ese equipo
    if (candidates.length === 0) {
      candidates = pool.filter((p) => !chosenIds.has(p.id));
    }
    if (candidates.length === 0) {
      candidates = pool;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const chosenPlayer = candidates[randomIndex];
    chosenIds.add(chosenPlayer.id);
    selectedCards.push(chosenPlayer);
  }

  // Ordenar por OVR ascendente para revelar la mejor carta al final
  selectedCards.sort((a, b) => {
    if (a.stats.ovr !== b.stats.ovr) {
      return a.stats.ovr - b.stats.ovr;
    }
    return RARITY_HIERARCHY[a.rarity] - RARITY_HIERARCHY[b.rarity];
  });

  const timestamp = Date.now();
  return selectedCards.map((player, idx) => ({
    instanceId: `${player.id}-${timestamp}-${Math.random().toString(36).substr(2, 9)}-${idx}`,
    playerId: player.id,
    player,
    obtainedAt: new Date().toISOString(),
    isLocked: false,
    gamesPlayed: 0,
  }));
};
