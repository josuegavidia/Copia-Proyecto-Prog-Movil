import { NBAPlayer, UserCard } from '../types';
import { ACTIVE_NBA_PLAYERS, NBA_PLAYERS_DATA } from './nbaPlayers';
import { ALL_ICON_PLAYERS, CLASSIC_TEAMS } from './classicTeams';
import { NBA_TEAMS } from './nbaTeams';
import { Language } from '../i18n/types';

export type AchievementCategory = 'ALL' | 'TEAMS' | 'COLLECTION' | 'CAREER' | 'GAMEPLAY';

export interface AchievementDefinition {
  id: string;
  category: 'TEAMS' | 'COLLECTION' | 'CAREER' | 'GAMEPLAY';
  title: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  rewardCoins: number;
  iconName: string;
  iconColor: string;
  badgeText?: string;
}

export interface CareerStats {
  daysLoggedIn: number;
  hasCoachPhoto: boolean;
  seasonsWon: number;
  totalPacksOpened: number;
  threePointHighScore: number;
}

export interface AchievementProgress {
  id: string;
  definition: AchievementDefinition;
  current: number;
  target: number;
  progressPct: number;
  isUnlocked: boolean;
  isClaimed: boolean;
}

// Master list of 18 video game achievements with witty titles, without emojis
export const ACHIEVEMENTS_LIST: AchievementDefinition[] = [
  // 1. Franquicia: New York Knicks
  {
    id: 'team_nyk',
    category: 'TEAMS',
    title: {
      es: 'El Rey de Nueva York',
      en: 'The King of New York',
    },
    description: {
      es: 'Completa la plantilla entera de los New York Knicks.',
      en: 'Collect all players from the New York Knicks roster.',
    },
    rewardCoins: 1200,
    iconName: 'business-outline',
    iconColor: '#F58426',
    badgeText: 'NYK',
  },

  // 2. Franquicia: Los Angeles Lakers
  {
    id: 'team_lal',
    category: 'TEAMS',
    title: {
      es: 'Showtime en Hollywood',
      en: 'Showtime in Hollywood',
    },
    description: {
      es: 'Completa la plantilla entera de Los Angeles Lakers.',
      en: 'Collect all players from the Los Angeles Lakers roster.',
    },
    rewardCoins: 1200,
    iconName: 'videocam-outline',
    iconColor: '#FDB927',
    badgeText: 'LAL',
  },

  // 3. Franquicia: Boston Celtics
  {
    id: 'team_bos',
    category: 'TEAMS',
    title: {
      es: 'Orgullo Celta',
      en: 'Celtic Pride',
    },
    description: {
      es: 'Completa la plantilla entera de los Boston Celtics.',
      en: 'Collect all players from the Boston Celtics roster.',
    },
    rewardCoins: 1200,
    iconName: 'shield-checkmark-outline',
    iconColor: '#007A33',
    badgeText: 'BOS',
  },

  // 4. Franquicia: Golden State Warriors
  {
    id: 'team_gsw',
    category: 'TEAMS',
    title: {
      es: 'Lluvia en la Bahía',
      en: 'Splash in the Bay',
    },
    description: {
      es: 'Completa la plantilla entera de Golden State Warriors.',
      en: 'Collect all players from the Golden State Warriors roster.',
    },
    rewardCoins: 1200,
    iconName: 'water-outline',
    iconColor: '#1D428A',
    badgeText: 'GSW',
  },

  // 5. Franquicia: Chicago Bulls
  {
    id: 'team_chi',
    category: 'TEAMS',
    title: {
      es: 'Viento de Campeones',
      en: 'Windy City Glory',
    },
    description: {
      es: 'Completa la plantilla entera de Chicago Bulls.',
      en: 'Collect all players from the Chicago Bulls roster.',
    },
    rewardCoins: 1200,
    iconName: 'flame-outline',
    iconColor: '#CE1141',
    badgeText: 'CHI',
  },

  // 6. Franquicia: Cualquier equipo al 100%
  {
    id: 'team_any',
    category: 'TEAMS',
    title: {
      es: 'Franquicia Blindada',
      en: 'Franchise Complete',
    },
    description: {
      es: 'Completa todos los jugadores de cualquier franquicia NBA activa.',
      en: 'Collect 100% of the active roster of any NBA franchise.',
    },
    rewardCoins: 1000,
    iconName: 'shield-outline',
    iconColor: '#0284C7',
    badgeText: 'ROSTER',
  },

  // 7. Colección: Conferencia Este
  {
    id: 'conf_east',
    category: 'COLLECTION',
    title: {
      es: 'Dominio del Este',
      en: 'Kings of the East',
    },
    description: {
      es: 'Colecciona todos los jugadores de la Conferencia Este.',
      en: 'Collect all players from the Eastern Conference.',
    },
    rewardCoins: 5000,
    iconName: 'compass-outline',
    iconColor: '#2563EB',
    badgeText: 'EAST',
  },

  // 8. Colección: Conferencia Oeste
  {
    id: 'conf_west',
    category: 'COLLECTION',
    title: {
      es: 'Fiebre del Salvaje Oeste',
      en: 'Wild West Conqueror',
    },
    description: {
      es: 'Colecciona todos los jugadores de la Conferencia Oeste.',
      en: 'Collect all players from the Western Conference.',
    },
    rewardCoins: 5000,
    iconName: 'earth-outline',
    iconColor: '#EA580C',
    badgeText: 'WEST',
  },

  // 9. Leyendas: Quinteto mítico
  {
    id: 'classic_team_any',
    category: 'COLLECTION',
    title: {
      es: 'Rebobinando la Cinta VHS',
      en: 'Rewinding the VHS Tape',
    },
    description: {
      es: 'Completa los 5 titulares de cualquier Classic Team mítico.',
      en: 'Collect all 5 starters of any legendary Classic Team.',
    },
    rewardCoins: 1500,
    iconName: 'film-outline',
    iconColor: '#8B5CF6',
    badgeText: 'CLASSIC',
  },

  // 10. Leyendas: Todas las leyendas
  {
    id: 'all_legends',
    category: 'COLLECTION',
    title: {
      es: 'Salón de la Fama Absoluto',
      en: 'Hall of Fame Pantheon',
    },
    description: {
      es: 'Desbloquea todas las cartas de Leyenda / Icon del juego.',
      en: 'Unlock all Iconic/Legendary classic cards in the game.',
    },
    rewardCoins: 15000,
    iconName: 'ribbon-outline',
    iconColor: '#D97706',
    badgeText: 'HOF',
  },

  // 11. Rareza: Todos los Diamantes
  {
    id: 'all_diamonds',
    category: 'COLLECTION',
    title: {
      es: 'Brillantez Eterna',
      en: 'Diamond Royalty',
    },
    description: {
      es: 'Consigue todas las cartas de rareza Diamante.',
      en: 'Collect all Diamond rarity cards in the game.',
    },
    rewardCoins: 10000,
    iconName: 'diamond-outline',
    iconColor: '#06B6D4',
    badgeText: 'DIAMOND',
  },

  // 12. Colección Máxima: Todo el juego
  {
    id: 'all_cards',
    category: 'COLLECTION',
    title: {
      es: 'El Coleccionista Supremo',
      en: 'The Ultimate Collector',
    },
    description: {
      es: 'Colecciona absolutamente todas las cartas existentes en la base de datos.',
      en: 'Collect every single card available in the game database.',
    },
    rewardCoins: 25000,
    iconName: 'planet-outline',
    iconColor: '#9333EA',
    badgeText: '100%',
  },

  // 13. Carrera: 30 Días de inicio de sesión
  {
    id: 'login_30_days',
    category: 'CAREER',
    title: {
      es: 'Veterano de la Franquicia',
      en: 'Franchise Veteran',
    },
    description: {
      es: 'Inicia sesión en la aplicación durante 30 días.',
      en: 'Log in to the application on 30 different days.',
    },
    rewardCoins: 3000,
    iconName: 'calendar-outline',
    iconColor: '#10B981',
    badgeText: '30 DAYS',
  },

  // 14. Carrera: Foto de Entrenador
  {
    id: 'coach_photo',
    category: 'CAREER',
    title: {
      es: 'Retrato en la Pizarra',
      en: 'Press Conference Ready',
    },
    description: {
      es: 'Crea y guarda un entrenador con fotografía personalizada.',
      en: 'Create and save a custom coach with an official photo.',
    },
    rewardCoins: 500,
    iconName: 'camera-outline',
    iconColor: '#6366F1',
    badgeText: 'COACH',
  },

  // 15. Carrera: Ganar Temporada Regular
  {
    id: 'season_champion',
    category: 'CAREER',
    title: {
      es: 'Anillo de Campeón',
      en: 'Championship Ring',
    },
    description: {
      es: 'Conquista el 1er lugar de la temporada regular de la NBA.',
      en: 'Finish 1st place in the NBA regular season standings.',
    },
    rewardCoins: 5000,
    iconName: 'trophy-outline',
    iconColor: '#EAB308',
    badgeText: 'RING',
  },

  // 16. Gameplay: Primer sobre abierto
  {
    id: 'first_pack',
    category: 'GAMEPLAY',
    title: {
      es: 'Día del Draft',
      en: 'Draft Day Rookie',
    },
    description: {
      es: 'Abre tu primer sobre de cartas en la tienda.',
      en: 'Open your very first card pack in the store.',
    },
    rewardCoins: 250,
    iconName: 'cube-outline',
    iconColor: '#14B8A6',
    badgeText: 'PACK',
  },

  // 17. Gameplay: Concurso de Triples 20+ pts
  {
    id: 'three_point_master',
    category: 'GAMEPLAY',
    title: {
      es: 'Muñeca Caliente',
      en: 'Hot Hands',
    },
    description: {
      es: 'Anota 20 o más puntos en el Concurso de Triples.',
      en: 'Score 20 or more points in the 3-Point Shootout Contest.',
    },
    rewardCoins: 750,
    iconName: 'radio-button-on-outline',
    iconColor: '#F43F5E',
    badgeText: '20+ PTS',
  },

  // 18. Gameplay: 10,000 Monedas acumuladas
  {
    id: 'coins_10k',
    category: 'GAMEPLAY',
    title: {
      es: 'Contrato Supermax',
      en: 'Supermax Contract',
    },
    description: {
      es: 'Acumula 10,000 monedas o más en tu cuenta.',
      en: 'Accumulate a balance of 10,000 coins or more.',
    },
    rewardCoins: 1000,
    iconName: 'cash-outline',
    iconColor: '#84CC16',
    badgeText: '10K',
  },
];

// Helper to evaluate all achievements based on current state
export const evaluateAchievements = (
  cards: UserCard[],
  coins: number,
  careerStats: CareerStats,
  claimedIds: string[]
): AchievementProgress[] => {
  const claimedSet = new Set(claimedIds || []);

  // Map of collected unique player IDs
  const collectedPlayerIds = new Set<string>();
  cards.forEach((c) => {
    const pid = c.player?.id || c.playerId;
    if (pid) collectedPlayerIds.add(pid);
  });

  // Master groupings
  const eastMasterPlayers = ACTIVE_NBA_PLAYERS.filter((p) => p.conference === 'Eastern');
  const westMasterPlayers = ACTIVE_NBA_PLAYERS.filter((p) => p.conference === 'Western');
  const diamondMasterPlayers = NBA_PLAYERS_DATA.filter((p) => p.rarity === 'DIAMOND');
  const allLegendsMaster = ALL_ICON_PLAYERS;
  const totalMasterCount = NBA_PLAYERS_DATA.length;

  // Counts by active franchise
  const teamPlayerCounts: Record<string, { total: number; collected: number }> = {};
  Object.keys(NBA_TEAMS).forEach((abbr) => {
    const teamPlayers = ACTIVE_NBA_PLAYERS.filter((p) => p.teamAbbr === abbr);
    const collected = teamPlayers.filter((p) => collectedPlayerIds.has(p.id)).length;
    teamPlayerCounts[abbr] = {
      total: teamPlayers.length || 1,
      collected,
    };
  });

  // Specific franchises
  const getTeamProgress = (abbr: string) => {
    const data = teamPlayerCounts[abbr] || { total: 15, collected: 0 };
    return {
      current: data.collected,
      target: data.total,
    };
  };

  // Any team 100% complete
  const anyTeamComplete = Object.values(teamPlayerCounts).some(
    (t) => t.total > 0 && t.collected >= t.total
  );

  // Classic teams check
  let maxClassicTeamCollected = 0;
  let anyClassicTeamComplete = false;
  CLASSIC_TEAMS.forEach((team) => {
    const teamCollected = team.starters.filter((p) => collectedPlayerIds.has(p.id)).length;
    if (teamCollected > maxClassicTeamCollected) {
      maxClassicTeamCollected = teamCollected;
    }
    if (teamCollected >= team.starters.length) {
      anyClassicTeamComplete = true;
    }
  });

  // East & West collected counts
  const eastCollected = eastMasterPlayers.filter((p) => collectedPlayerIds.has(p.id)).length;
  const westCollected = westMasterPlayers.filter((p) => collectedPlayerIds.has(p.id)).length;

  // Diamond & Legends collected counts
  const diamondCollected = diamondMasterPlayers.filter((p) => collectedPlayerIds.has(p.id)).length;
  const legendsCollected = allLegendsMaster.filter((p) => collectedPlayerIds.has(p.id)).length;
  const totalUniqueCollected = collectedPlayerIds.size;

  return ACHIEVEMENTS_LIST.map((def) => {
    let current = 0;
    let target = 1;

    switch (def.id) {
      case 'team_nyk': {
        const p = getTeamProgress('NYK');
        current = p.current;
        target = p.target;
        break;
      }
      case 'team_lal': {
        const p = getTeamProgress('LAL');
        current = p.current;
        target = p.target;
        break;
      }
      case 'team_bos': {
        const p = getTeamProgress('BOS');
        current = p.current;
        target = p.target;
        break;
      }
      case 'team_gsw': {
        const p = getTeamProgress('GSW');
        current = p.current;
        target = p.target;
        break;
      }
      case 'team_chi': {
        const p = getTeamProgress('CHI');
        current = p.current;
        target = p.target;
        break;
      }
      case 'team_any':
        current = anyTeamComplete ? 1 : 0;
        target = 1;
        break;
      case 'conf_east':
        current = eastCollected;
        target = eastMasterPlayers.length;
        break;
      case 'conf_west':
        current = westCollected;
        target = westMasterPlayers.length;
        break;
      case 'classic_team_any':
        current = anyClassicTeamComplete ? 5 : maxClassicTeamCollected;
        target = 5;
        break;
      case 'all_legends':
        current = legendsCollected;
        target = allLegendsMaster.length;
        break;
      case 'all_diamonds':
        current = diamondCollected;
        target = diamondMasterPlayers.length;
        break;
      case 'all_cards':
        current = totalUniqueCollected;
        target = totalMasterCount;
        break;
      case 'login_30_days':
        current = Math.min(30, careerStats.daysLoggedIn || 1);
        target = 30;
        break;
      case 'coach_photo':
        current = careerStats.hasCoachPhoto ? 1 : 0;
        target = 1;
        break;
      case 'season_champion':
        current = careerStats.seasonsWon > 0 ? 1 : 0;
        target = 1;
        break;
      case 'first_pack':
        current = (careerStats.totalPacksOpened || 0) > 0 ? 1 : 0;
        target = 1;
        break;
      case 'three_point_master':
        current = Math.min(20, careerStats.threePointHighScore || 0);
        target = 20;
        break;
      case 'coins_10k':
        current = Math.min(10000, coins);
        target = 10000;
        break;
      default:
        current = 0;
        target = 1;
    }

    const isUnlocked = current >= target;
    const isClaimed = claimedSet.has(def.id);
    const progressPct = Math.min(100, Math.round((current / (target || 1)) * 100));

    return {
      id: def.id,
      definition: def,
      current,
      target,
      progressPct,
      isUnlocked,
      isClaimed,
    };
  });
};
