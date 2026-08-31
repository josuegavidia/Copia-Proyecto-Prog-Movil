export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export type CardRarity = 'DIAMOND' | 'GOLD' | 'SILVER' | 'BRONZE';

export type Conference = 'Eastern' | 'Western';

export interface PlayerStats {
  ovr: number;
  offense: number;
  defense: number;
  playmaking: number;
  rebound: number;
  threePoint: number;
  dunk: number;
  speed: number;
}

export interface NBATeamInfo {
  name: string;
  city: string;
  abbreviation: string;
  conference: Conference;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
}

export interface NBAPlayer {
  id: string;
  nbaPersonId: number; // Official NBA CDN ID
  name: string;
  nickname?: string;
  team: string;
  teamAbbr: string;
  conference: Conference;
  position: Position;
  secondaryPosition?: Position;
  number: number;
  rarity: CardRarity;
  stats: PlayerStats;
  imageUrl: string;
  isLegend?: boolean;
}

export interface UserCard {
  instanceId: string;
  playerId: string;
  player: NBAPlayer;
  obtainedAt: string;
  isLocked?: boolean;
  gamesPlayed?: number;
}

export type TacticStyle = 
  | 'Pace & Space' 
  | 'Showtime Fastbreak' 
  | 'Lockdown Defense' 
  | 'Triangle Offense' 
  | 'Small Ball' 
  | 'Grit & Grind';

export interface CustomCoach {
  id: string;
  name: string;
  photoUri: string;
  teamAffinity: string; // Team Abbr
  tactic: TacticStyle;
  boostOffense: number;
  boostDefense: number;
  boostChemistry: number;
  signatureQuote: string;
  createdAt: string;
  bgColor?: string; // Custom background color
  secondaryBgColor?: string;
  isCutout?: boolean;
  cutoutShape?: 'bust' | 'oval' | 'square';
}

export interface SquadLineup {
  teamName?: string;
  teamLogo?: string;
  teamAbbr?: string;
  pg: UserCard | null;
  sg: UserCard | null;
  sf: UserCard | null;
  pf: UserCard | null;
  c: UserCard | null;
  coach: CustomCoach | null;
}

export interface StructuredSynergyBonus {
  iconName: string;
  text: string;
  type: 'positive' | 'warning' | 'coach';
}

export interface SquadSynergy {
  totalOvr: number;
  teamChemistry: number; // 0 - 100
  offenseRating: number;
  defenseRating: number;
  teamBonuses: string[];
  structuredBonuses?: StructuredSynergyBonus[];
}

export interface PackDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  cardCount: number;
  themeColor: string;
  secondaryColor?: string;
  badge: string;
  guaranteedMinRarity: CardRarity;
  conferenceOnly?: Conference;
  rarityChances: {
    diamond: number;
    gold: number;
    silver: number;
    bronze: number;
  };
}

export interface TeamStanding {
  teamAbbr: string;
  teamName: string;
  conference: Conference;
  logoUrl: string;
  wins: number;
  losses: number;
  streak: string;
  isUserTeam?: boolean;
}

export interface SeasonProgress {
  currentMatchIndex: number;
  totalMatches: number;
  standings: TeamStanding[];
  seasonNumber: number;
  historyLogs: string[];
  isCompleted?: boolean;
  rewardClaimed?: boolean;
  finalRank?: number;
}
