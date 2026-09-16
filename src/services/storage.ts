import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCard, SquadLineup, CustomCoach, SeasonProgress, TeamStanding } from '../types';
import { NBA_PLAYERS_DATA } from '../data/nbaPlayers';
import { NBA_TEAMS } from '../data/nbaTeams';

const KEYS = {
  COINS: '@nba_entregable_coins_v5',
  CARDS: '@nba_entregable_cards_v5',
  LINEUP: '@nba_entregable_lineup_v5',
  COACHES: '@nba_entregable_coaches_v5',
  FIRST_LAUNCH: '@nba_entregable_first_launch_v5',
  SEASON: '@nba_entregable_season_standings_v5',
  LAST_FREE_PACK: '@nba_entregable_last_free_pack_v5',
  TEAM_NAME: '@nba_entregable_team_name_v5',
  TEAM_LOGO: '@nba_entregable_team_logo_v5',
  TEAM_ABBR: '@nba_entregable_team_abbr_v5',
  THREE_POINT_RECORD: '@nba_entregable_3pt_record_v5',
  LANGUAGE: '@nba_entregable_language_v1',
  CLAIMED_ACHIEVEMENTS: '@nba_entregable_claimed_achievements_v1',
  LOGIN_DAYS_RECORD: '@nba_entregable_login_days_v1',
  CAREER_STATS: '@nba_entregable_career_stats_v1',
};

export const createStarterCards = (): UserCard[] => {
  // Aplicación nueva inicia vacía (0 cartas)
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
    totalMatches: 30, // Exact 30 Matches against all 30 NBA Rival Franchises
    standings,
    seasonNumber,
    historyLogs: [],
    isCompleted: false,
    rewardClaimed: false,
  };
};

export const StorageService = {
  // Check if first launch and initialize clean empty state
  initApp: async () => {
    try {
      const launched = await AsyncStorage.getItem(KEYS.FIRST_LAUNCH);
      if (!launched) {
        // Inicializar completamente vacío
        await AsyncStorage.setItem(KEYS.CARDS, JSON.stringify([]));
        await AsyncStorage.setItem(KEYS.COINS, '500');
        
        const initialLineup: SquadLineup = {
          pg: null,
          sg: null,
          sf: null,
          pf: null,
          c: null,
          coach: null,
        };
        await AsyncStorage.setItem(KEYS.LINEUP, JSON.stringify(initialLineup));
        await AsyncStorage.setItem(KEYS.COACHES, JSON.stringify([]));
        await AsyncStorage.setItem(KEYS.TEAM_NAME, 'Mi Franquicia');
        await AsyncStorage.setItem(KEYS.SEASON, JSON.stringify(createInitialSeason()));
        await AsyncStorage.setItem(KEYS.FIRST_LAUNCH, 'true');
      }
    } catch (e) {
      console.error('Failed to init app storage:', e);
    }
  },

  // Reset all to empty
  clearAll: async () => {
    try {
      const allKeys = Object.values(KEYS);
      await AsyncStorage.multiRemove(allKeys);
      await StorageService.initApp();
    } catch (e) {
      console.error('Failed to clear app storage:', e);
    }
  },

  // Coins
  getCoins: async (): Promise<number> => {
    try {
      const val = await AsyncStorage.getItem(KEYS.COINS);
      return val !== null ? parseInt(val, 10) : 500;
    } catch {
      return 500;
    }
  },

  setCoins: async (amount: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.COINS, amount.toString());
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
      const val = await AsyncStorage.getItem(KEYS.CARDS);
      if (!val) return [];
      const rawCards: UserCard[] = JSON.parse(val);

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
      await AsyncStorage.setItem(KEYS.CARDS, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to set cards', e);
    }
  },

  addCards: async (newCards: UserCard[]): Promise<UserCard[]> => {
    const existing = await StorageService.getCards();
    const updated = [...newCards, ...existing];
    await AsyncStorage.setItem(KEYS.CARDS, JSON.stringify(updated));
    return updated;
  },

  removeCard: async (instanceId: string): Promise<UserCard[]> => {
    const existing = await StorageService.getCards();
    const updated = existing.filter((c) => c.instanceId !== instanceId);
    await AsyncStorage.setItem(KEYS.CARDS, JSON.stringify(updated));
    return updated;
  },

  // Squad Lineup
  getLineup: async (): Promise<SquadLineup> => {
    try {
      const val = await AsyncStorage.getItem(KEYS.LINEUP);
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
      await AsyncStorage.setItem(KEYS.LINEUP, JSON.stringify(lineup));
    } catch (e) {
      console.error('Failed to save lineup', e);
    }
  },

  // Custom Coaches
  getCoaches: async (): Promise<CustomCoach[]> => {
    try {
      const val = await AsyncStorage.getItem(KEYS.COACHES);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },

  saveCoach: async (coach: CustomCoach): Promise<CustomCoach[]> => {
    const existing = await StorageService.getCoaches();
    const updated = [coach, ...existing.filter((c) => c.id !== coach.id)];
    await AsyncStorage.setItem(KEYS.COACHES, JSON.stringify(updated));
    return updated;
  },

  // Team Name
  getTeamName: async (): Promise<string> => {
    try {
      const val = await AsyncStorage.getItem(KEYS.TEAM_NAME);
      return val || 'Mi Quinteto';
    } catch {
      return 'Mi Quinteto';
    }
  },

  setTeamName: async (name: string): Promise<string> => {
    try {
      const trimmed = name.trim() || 'Mi Quinteto';
      await AsyncStorage.setItem(KEYS.TEAM_NAME, trimmed);

      // Also update teamName in stored season if present
      const seasonVal = await AsyncStorage.getItem(KEYS.SEASON);
      if (seasonVal) {
        const parsed: SeasonProgress = JSON.parse(seasonVal);
        const updatedStandings = parsed.standings.map((t) =>
          t.isUserTeam ? { ...t, teamName: trimmed } : t
        );
        await AsyncStorage.setItem(KEYS.SEASON, JSON.stringify({ ...parsed, standings: updatedStandings }));
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
      const val = await AsyncStorage.getItem(KEYS.TEAM_LOGO);
      return val || 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png';
    } catch {
      return 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png';
    }
  },

  setTeamLogo: async (logoUrl: string): Promise<string> => {
    try {
      await AsyncStorage.setItem(KEYS.TEAM_LOGO, logoUrl);

      // Also update logo in stored season if present
      const seasonVal = await AsyncStorage.getItem(KEYS.SEASON);
      if (seasonVal) {
        const parsed: SeasonProgress = JSON.parse(seasonVal);
        const updatedStandings = parsed.standings.map((t) =>
          t.isUserTeam ? { ...t, logoUrl } : t
        );
        await AsyncStorage.setItem(KEYS.SEASON, JSON.stringify({ ...parsed, standings: updatedStandings }));
      }
      return logoUrl;
    } catch (e) {
      console.error('Failed to set team logo', e);
      return logoUrl;
    }
  },

  getTeamAbbr: async (): Promise<string> => {
    try {
      const val = await AsyncStorage.getItem(KEYS.TEAM_ABBR);
      return val || 'LAL';
    } catch {
      return 'LAL';
    }
  },

  setTeamAbbr: async (abbr: string): Promise<string> => {
    try {
      await AsyncStorage.setItem(KEYS.TEAM_ABBR, abbr);
      const seasonVal = await AsyncStorage.getItem(KEYS.SEASON);
      if (seasonVal) {
        const parsed: SeasonProgress = JSON.parse(seasonVal);
        const updatedStandings = parsed.standings.map((t) =>
          t.isUserTeam ? { ...t, teamAbbr: abbr } : t
        );
        await AsyncStorage.setItem(KEYS.SEASON, JSON.stringify({ ...parsed, standings: updatedStandings }));
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
      const val = await AsyncStorage.getItem(KEYS.SEASON);
      if (val) {
        const parsed: SeasonProgress = JSON.parse(val);
        // Ensure totalMatches is always migrated to 30 matches and custom teamName/logo is set
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
      await AsyncStorage.setItem(KEYS.SEASON, JSON.stringify(season));
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
      const val = await AsyncStorage.getItem(KEYS.LAST_FREE_PACK);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  setLastFreePackTime: async (timestamp: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.LAST_FREE_PACK, timestamp.toString());
    } catch (e) {
      console.error('Failed to set last free pack time', e);
    }
  },

  getThreePointHighScore: async (): Promise<{ score: number; shooterName: string }> => {
    try {
      const val = await AsyncStorage.getItem(KEYS.THREE_POINT_RECORD);
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
          KEYS.THREE_POINT_RECORD,
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
      const val = await AsyncStorage.getItem(KEYS.LANGUAGE);
      return val === 'en' ? 'en' : 'es';
    } catch {
      return 'es';
    }
  },

  setLanguage: async (lang: 'es' | 'en'): Promise<void> => {
    try {
      await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  },

  // Daily Login Tracker
  recordDailyLogin: async (): Promise<number> => {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const raw = await AsyncStorage.getItem(KEYS.LOGIN_DAYS_RECORD);
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
        await AsyncStorage.setItem(KEYS.LOGIN_DAYS_RECORD, JSON.stringify(record));
      }

      return record.days || 1;
    } catch {
      return 1;
    }
  },

  getLoginDays: async (): Promise<number> => {
    try {
      const raw = await AsyncStorage.getItem(KEYS.LOGIN_DAYS_RECORD);
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
      const raw = await AsyncStorage.getItem(KEYS.CLAIMED_ACHIEVEMENTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  claimAchievement: async (achievementId: string): Promise<string[]> => {
    try {
      const current = await StorageService.getClaimedAchievements();
      if (!current.includes(achievementId)) {
        const updated = [...current, achievementId];
        await AsyncStorage.setItem(KEYS.CLAIMED_ACHIEVEMENTS, JSON.stringify(updated));
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
      const raw = await AsyncStorage.getItem(KEYS.CAREER_STATS);
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
      await AsyncStorage.setItem(KEYS.CAREER_STATS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update career stats', e);
      return null;
    }
  },
};
