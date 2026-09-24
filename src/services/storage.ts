import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCard, SquadLineup, CustomCoach, SeasonProgress, TeamStanding } from '../types';
import { NBA_PLAYERS_DATA } from '../data/nbaPlayers';
import { NBA_TEAMS } from '../data/nbaTeams';

let currentUserId: string | null = null;

const BASE_KEYS = {
  COINS: 'coins_v7',
  CARDS: 'cards_v7',
  LINEUP: 'lineup_v7',
  COACHES: 'coaches_v7',
  FIRST_LAUNCH: 'first_launch_v7',
  SEASON: 'season_standings_v7',
  LAST_FREE_PACK: 'last_free_pack_v7',
  TEAM_NAME: 'team_name_v7',
  TEAM_LOGO: 'team_logo_v7',
  TEAM_ABBR: 'team_abbr_v7',
  THREE_POINT_RECORD: '3pt_record_v7',
  LANGUAGE: 'language_v1',
  CLAIMED_ACHIEVEMENTS: 'claimed_achievements_v7',
  LOGIN_DAYS_RECORD: 'login_days_v7',
  CAREER_STATS: 'career_stats_v7',
  STARTER_PACK_CLAIMED: 'starter_pack_claimed_v7',
};

const getKey = (baseKey: string): string => {
  // Language is global across the device
  if (baseKey === BASE_KEYS.LANGUAGE) {
    return `@nba_global_${baseKey}`;
  }
  const uid = currentUserId || 'guest';
  return `@nba_user_${uid}_${baseKey}`;
};

export const createAllCollectionCards = (): UserCard[] => {
  return NBA_PLAYERS_DATA.map((player) => ({
    instanceId: `card_unlocked_${player.id}`,
    playerId: player.id,
    player,
    obtainedAt: new Date().toISOString(),
    isLocked: false,
    gamesPlayed: 0,
  }));
};

export const createStarterCards = (): UserCard[] => {
  return [];
};

const createInitialSeason = (
  seasonNumber = 1,
  userTeamName = 'Mi Franquicia',
  userTeamLogo = 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  userTeamAbbr = 'LAL'
): SeasonProgress => {
  const standings: TeamStanding[] = [
    {
      teamAbbr: userTeamAbbr,
      teamName: userTeamName,
      conference: 'Western',
      logoUrl: userTeamLogo,
      wins: 0,
      losses: 0,
      streak: '-',
      isUserTeam: true,
    },
    ...Object.values(NBA_TEAMS).map((t) => ({
      teamAbbr: t.abbreviation,
      teamName: t.name,
      conference: t.conference,
      logoUrl: t.logoUrl,
      wins: 0,
      losses: 0,
      streak: '-',
      isUserTeam: false,
    })),
  ];

  return {
    currentMatchIndex: 1,
    totalMatches: 30, // 30 jornadas contra las 30 franquicias oficiales de la NBA
    standings,
    seasonNumber,
    historyLogs: [],
    isCompleted: false,
    rewardClaimed: false,
  };
};

export const StorageService = {
  // Manage active user for storage scoping
  setActiveUser: (userId: string | null) => {
    currentUserId = userId;
  },

  getActiveUser: (): string | null => {
    return currentUserId;
  },

  // Check if first launch for active user and initialize clean empty state
  initApp: async (userId?: string) => {
    if (userId !== undefined) {
      currentUserId = userId;
    }
    try {
      const launchKey = getKey(BASE_KEYS.FIRST_LAUNCH);
      const launched = await AsyncStorage.getItem(launchKey);
      if (!launched) {
        // Inicializar cada cuenta con inventario limpio (0 jugadores iniciales hasta abrir sobres)
        const initialCoins = currentUserId && currentUserId !== 'guest' ? '1500' : '500';
        await AsyncStorage.setItem(getKey(BASE_KEYS.CARDS), JSON.stringify([]));
        await AsyncStorage.setItem(getKey(BASE_KEYS.COINS), initialCoins);
        
        const initialLineup: SquadLineup = {
          pg: null,
          sg: null,
          sf: null,
          pf: null,
          c: null,
          coach: null,
        };
        await AsyncStorage.setItem(getKey(BASE_KEYS.LINEUP), JSON.stringify(initialLineup));
        await AsyncStorage.setItem(getKey(BASE_KEYS.COACHES), JSON.stringify([]));
        await AsyncStorage.setItem(getKey(BASE_KEYS.TEAM_NAME), 'Mi Franquicia');
        await AsyncStorage.setItem(getKey(BASE_KEYS.TEAM_LOGO), 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png');
        await AsyncStorage.setItem(getKey(BASE_KEYS.TEAM_ABBR), 'LAL');
        await AsyncStorage.setItem(getKey(BASE_KEYS.SEASON), JSON.stringify(createInitialSeason()));
        await AsyncStorage.setItem(getKey(BASE_KEYS.CLAIMED_ACHIEVEMENTS), JSON.stringify([]));
        await AsyncStorage.setItem(launchKey, 'true');
      }
    } catch (e) {
      console.error('Failed to init app storage:', e);
    }
  },

  // Reset active user's local storage to empty
  clearAll: async () => {
    try {
      const userKeys = Object.values(BASE_KEYS).map((k) => getKey(k));
      await AsyncStorage.multiRemove(userKeys);
      await StorageService.initApp();
    } catch (e) {
      console.error('Failed to clear app storage:', e);
    }
  },

  // Coins
  getCoins: async (): Promise<number> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.COINS));
      if (val !== null) return parseInt(val, 10);
      return currentUserId && currentUserId !== 'guest' ? 1500 : 500;
    } catch {
      return 500;
    }
  },

  setCoins: async (amount: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.COINS), amount.toString());
    } catch (e) {
      console.error('Failed to set coins', e);
    }
  },

  addCoins: async (amount: number): Promise<number> => {
    const current = await StorageService.getCoins();
    const updated = Math.max(0, current + amount);
    await StorageService.setCoins(updated);
    return updated;
  },

  // Cards Collection
  getCards: async (): Promise<UserCard[]> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.CARDS));
      let rawCards: UserCard[] = val ? JSON.parse(val) : [];

      if (!rawCards || !Array.isArray(rawCards) || rawCards.length === 0) {
        return [];
      }

      // Hydrate against NBA_PLAYERS_DATA to guarantee accurate official player attributes and portraits
      const playerMapById = new Map(NBA_PLAYERS_DATA.map((p) => [p.id, p]));
      const playerMapByName = new Map(NBA_PLAYERS_DATA.map((p) => [p.name.toLowerCase().trim(), p]));

      return rawCards.map((card) => {
        const canonical =
          playerMapById.get(card.playerId) ||
          playerMapById.get(card.player?.id) ||
          (card.player?.name ? playerMapByName.get(card.player.name.toLowerCase().trim()) : undefined);

        if (canonical) {
          return {
            ...card,
            playerId: canonical.id,
            player: canonical,
          };
        }
        return card;
      });
    } catch {
      return [];
    }
  },

  setCards: async (cards: UserCard[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.CARDS), JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to set cards', e);
    }
  },

  addCards: async (newCards: UserCard[]): Promise<UserCard[]> => {
    const existing = await StorageService.getCards();
    const updated = [...newCards, ...existing];
    await AsyncStorage.setItem(getKey(BASE_KEYS.CARDS), JSON.stringify(updated));
    return updated;
  },

  removeCard: async (instanceId: string): Promise<UserCard[]> => {
    const existing = await StorageService.getCards();
    const updated = existing.filter((c) => c.instanceId !== instanceId);
    await AsyncStorage.setItem(getKey(BASE_KEYS.CARDS), JSON.stringify(updated));
    return updated;
  },

  // Squad Lineup
  getLineup: async (): Promise<SquadLineup> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.LINEUP));
      if (val) {
        const parsed: SquadLineup = JSON.parse(val);
        const playerMapById = new Map(NBA_PLAYERS_DATA.map((p) => [p.id, p]));
        const playerMapByName = new Map(NBA_PLAYERS_DATA.map((p) => [p.name.toLowerCase().trim(), p]));
        
        const hydrateCard = (card: UserCard | null): UserCard | null => {
          if (!card) return null;
          const canonical =
            playerMapById.get(card.playerId) ||
            playerMapById.get(card.player?.id) ||
            (card.player?.name ? playerMapByName.get(card.player.name.toLowerCase().trim()) : undefined);
          return canonical ? { ...card, playerId: canonical.id, player: canonical } : card;
        };

        return {
          pg: hydrateCard(parsed.pg),
          sg: hydrateCard(parsed.sg),
          sf: hydrateCard(parsed.sf),
          pf: hydrateCard(parsed.pf),
          c: hydrateCard(parsed.c),
          coach: parsed.coach || null,
        };
      }
    } catch {}
    return { pg: null, sg: null, sf: null, pf: null, c: null, coach: null };
  },

  saveLineup: async (lineup: SquadLineup): Promise<void> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.LINEUP), JSON.stringify(lineup));
    } catch (e) {
      console.error('Failed to save lineup', e);
    }
  },

  // Custom Coaches
  getCoaches: async (): Promise<CustomCoach[]> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.COACHES));
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },

  saveCoach: async (coach: CustomCoach): Promise<CustomCoach[]> => {
    const existing = await StorageService.getCoaches();
    const updated = [coach, ...existing.filter((c) => c.id !== coach.id)];
    await AsyncStorage.setItem(getKey(BASE_KEYS.COACHES), JSON.stringify(updated));
    return updated;
  },

  saveAllCoaches: async (coaches: CustomCoach[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.COACHES), JSON.stringify(coaches));
    } catch (e) {
      console.error('Failed to save all coaches', e);
    }
  },

  // Team Name
  getTeamName: async (): Promise<string> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.TEAM_NAME));
      return val || 'Mi Quinteto';
    } catch {
      return 'Mi Quinteto';
    }
  },

  setTeamName: async (name: string): Promise<string> => {
    try {
      const trimmed = name.trim() || 'Mi Quinteto';
      await AsyncStorage.setItem(getKey(BASE_KEYS.TEAM_NAME), trimmed);

      // Also update teamName in stored season if present
      const seasonVal = await AsyncStorage.getItem(getKey(BASE_KEYS.SEASON));
      if (seasonVal) {
        const parsed: SeasonProgress = JSON.parse(seasonVal);
        const updatedStandings = parsed.standings.map((t) =>
          t.isUserTeam ? { ...t, teamName: trimmed } : t
        );
        await AsyncStorage.setItem(getKey(BASE_KEYS.SEASON), JSON.stringify({ ...parsed, standings: updatedStandings }));
      }
      return trimmed;
    } catch (e) {
      console.error('Failed to set team name', e);
      return name;
    }
  },

  // Team Logo & Franchise Customization
  getTeamLogo: async (): Promise<string> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.TEAM_LOGO));
      return val || 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png';
    } catch {
      return 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png';
    }
  },

  setTeamLogo: async (logoUrl: string): Promise<string> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.TEAM_LOGO), logoUrl);

      // Also update logo in stored season if present
      const seasonVal = await AsyncStorage.getItem(getKey(BASE_KEYS.SEASON));
      if (seasonVal) {
        const parsed: SeasonProgress = JSON.parse(seasonVal);
        const updatedStandings = parsed.standings.map((t) =>
          t.isUserTeam ? { ...t, logoUrl } : t
        );
        await AsyncStorage.setItem(getKey(BASE_KEYS.SEASON), JSON.stringify({ ...parsed, standings: updatedStandings }));
      }
      return logoUrl;
    } catch (e) {
      console.error('Failed to set team logo', e);
      return logoUrl;
    }
  },

  getTeamAbbr: async (): Promise<string> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.TEAM_ABBR));
      return val || 'LAL';
    } catch {
      return 'LAL';
    }
  },

  setTeamAbbr: async (abbr: string): Promise<string> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.TEAM_ABBR), abbr);
      const seasonVal = await AsyncStorage.getItem(getKey(BASE_KEYS.SEASON));
      if (seasonVal) {
        const parsed: SeasonProgress = JSON.parse(seasonVal);
        const updatedStandings = parsed.standings.map((t) =>
          t.isUserTeam ? { ...t, teamAbbr: abbr } : t
        );
        await AsyncStorage.setItem(getKey(BASE_KEYS.SEASON), JSON.stringify({ ...parsed, standings: updatedStandings }));
      }
      return abbr;
    } catch {
      return abbr;
    }
  },

  // Season Progress & Standings Table
  getSeason: async (): Promise<SeasonProgress> => {
    try {
      const teamName = await StorageService.getTeamName();
      const teamLogo = await StorageService.getTeamLogo();
      const teamAbbr = await StorageService.getTeamAbbr();
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.SEASON));
      if (val) {
        const parsed: SeasonProgress = JSON.parse(val);
        const standings = parsed.standings.map((t) =>
          t.isUserTeam ? { ...t, teamName, logoUrl: teamLogo, teamAbbr } : t
        );
        return {
          ...parsed,
          totalMatches: 30,
          standings,
        };
      }
      return createInitialSeason(1, teamName, teamLogo, teamAbbr);
    } catch {}
    return createInitialSeason(1);
  },

  saveSeason: async (season: SeasonProgress): Promise<void> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.SEASON), JSON.stringify(season));
    } catch (e) {
      console.error('Failed to save season', e);
    }
  },

  resetSeason: async (): Promise<SeasonProgress> => {
    const teamName = await StorageService.getTeamName();
    const teamLogo = await StorageService.getTeamLogo();
    const teamAbbr = await StorageService.getTeamAbbr();
    const newSeason = createInitialSeason(1, teamName, teamLogo, teamAbbr);
    await StorageService.saveSeason(newSeason);
    return newSeason;
  },

  advanceToNextSeason: async (completedSeason: SeasonProgress): Promise<SeasonProgress> => {
    const teamName = await StorageService.getTeamName();
    const teamLogo = await StorageService.getTeamLogo();
    const teamAbbr = await StorageService.getTeamAbbr();
    const nextSeasonNum = (completedSeason.seasonNumber || 1) + 1;
    const newSeason = createInitialSeason(nextSeasonNum, teamName, teamLogo, teamAbbr);
    await StorageService.saveSeason(newSeason);
    return newSeason;
  },

  // Free Bronze Pack Timer (5 mins cooldown)
  getLastFreePackTime: async (): Promise<number> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.LAST_FREE_PACK));
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  setLastFreePackTime: async (timestamp: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.LAST_FREE_PACK), timestamp.toString());
    } catch (e) {
      console.error('Failed to set last free pack time', e);
    }
  },

  getThreePointHighScore: async (): Promise<{ score: number; shooterName: string }> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.THREE_POINT_RECORD));
      if (val) {
        return JSON.parse(val);
      }
    } catch {}
    return { score: 0, shooterName: 'Ninguno' };
  },

  saveThreePointHighScore: async (score: number, shooterName: string): Promise<boolean> => {
    try {
      const current = await StorageService.getThreePointHighScore();
      if (score > current.score) {
        await AsyncStorage.setItem(
          getKey(BASE_KEYS.THREE_POINT_RECORD),
          JSON.stringify({ score, shooterName, date: new Date().toISOString() })
        );
        // Also update career stats
        await StorageService.updateCareerStats((prev) => ({
          ...prev,
          threePointHighScore: Math.max(prev.threePointHighScore, score),
        }));
        return true; // New record
      }
    } catch (e) {
      console.error('Failed to save 3pt high score', e);
    }
    return false;
  },

  // Language Settings
  getLanguage: async (): Promise<'es' | 'en'> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.LANGUAGE));
      return val === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  },

  setLanguage: async (lang: 'es' | 'en'): Promise<void> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.LANGUAGE), lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  },

  // Daily Login Tracker
  recordDailyLogin: async (): Promise<number> => {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const raw = await AsyncStorage.getItem(getKey(BASE_KEYS.LOGIN_DAYS_RECORD));
      let record: { lastDate: string; days: number; history: string[] } = {
        lastDate: '',
        days: 0,
        history: [],
      };

      if (raw) {
        record = JSON.parse(raw);
      }

      if (record.lastDate !== today) {
        record.lastDate = today;
        record.days = (record.days || 0) + 1;
        if (!record.history) record.history = [];
        record.history.push(today);
        await AsyncStorage.setItem(getKey(BASE_KEYS.LOGIN_DAYS_RECORD), JSON.stringify(record));
      }

      return record.days || 1;
    } catch {
      return 1;
    }
  },

  getLoginDays: async (): Promise<number> => {
    try {
      const raw = await AsyncStorage.getItem(getKey(BASE_KEYS.LOGIN_DAYS_RECORD));
      if (raw) {
        const record = JSON.parse(raw);
        return record.days || 1;
      }
    } catch {}
    return 1;
  },

  // Claimed Achievements
  getClaimedAchievements: async (): Promise<string[]> => {
    try {
      const raw = await AsyncStorage.getItem(getKey(BASE_KEYS.CLAIMED_ACHIEVEMENTS));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveClaimedAchievements: async (achievements: string[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(getKey(BASE_KEYS.CLAIMED_ACHIEVEMENTS), JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save claimed achievements', e);
    }
  },

  claimAchievement: async (achievementId: string): Promise<string[]> => {
    try {
      const current = await StorageService.getClaimedAchievements();
      if (!current.includes(achievementId)) {
        const updated = [...current, achievementId];
        await AsyncStorage.setItem(getKey(BASE_KEYS.CLAIMED_ACHIEVEMENTS), JSON.stringify(updated));
        return updated;
      }
      return current;
    } catch {
      return [];
    }
  },

  // Career Stats Tracker
  getCareerStats: async (): Promise<{
    daysLoggedIn: number;
    hasCoachPhoto: boolean;
    seasonsWon: number;
    totalPacksOpened: number;
    threePointHighScore: number;
  }> => {
    try {
      const raw = await AsyncStorage.getItem(getKey(BASE_KEYS.CAREER_STATS));
      const loginDays = await StorageService.getLoginDays();
      const threePt = await StorageService.getThreePointHighScore();

      const defaults = {
        daysLoggedIn: loginDays,
        hasCoachPhoto: false,
        seasonsWon: 0,
        totalPacksOpened: 0,
        threePointHighScore: threePt.score || 0,
      };

      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...defaults,
          ...parsed,
          daysLoggedIn: loginDays,
          threePointHighScore: Math.max(parsed.threePointHighScore || 0, threePt.score || 0),
        };
      }
      return defaults;
    } catch {
      return {
        daysLoggedIn: 1,
        hasCoachPhoto: false,
        seasonsWon: 0,
        totalPacksOpened: 0,
        threePointHighScore: 0,
      };
    }
  },

  updateCareerStats: async (
    updater: (prev: {
      daysLoggedIn: number;
      hasCoachPhoto: boolean;
      seasonsWon: number;
      totalPacksOpened: number;
      threePointHighScore: number;
    }) => {
      daysLoggedIn: number;
      hasCoachPhoto: boolean;
      seasonsWon: number;
      totalPacksOpened: number;
      threePointHighScore: number;
    }
  ) => {
    try {
      const current = await StorageService.getCareerStats();
      const updated = updater(current);
      await AsyncStorage.setItem(getKey(BASE_KEYS.CAREER_STATS), JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update career stats', e);
      return null;
    }
  },

  // Starter Welcome Pack Claimed Status
  hasClaimedStarterPack: async (): Promise<boolean> => {
    try {
      const val = await AsyncStorage.getItem(getKey(BASE_KEYS.STARTER_PACK_CLAIMED));
      return val === 'true';
    } catch {
      return false;
    }
  },

  setClaimedStarterPack: async (claimed: boolean = true): Promise<void> => {
    try {
      if (claimed) {
        await AsyncStorage.setItem(getKey(BASE_KEYS.STARTER_PACK_CLAIMED), 'true');
      } else {
        await AsyncStorage.removeItem(getKey(BASE_KEYS.STARTER_PACK_CLAIMED));
      }
    } catch (e) {
      console.error('Failed to set claimed starter pack status', e);
    }
  },
};
