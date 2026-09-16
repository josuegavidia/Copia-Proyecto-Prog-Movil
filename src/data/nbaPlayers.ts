import { NBAPlayer } from '../types';
import { ALL_ICON_PLAYERS } from './classicTeams';
import { ATLANTIC_PLAYERS } from './rosters/atlantic';
import { CENTRAL_PLAYERS } from './rosters/central';
import { SOUTHEAST_PLAYERS } from './rosters/southeast';
import { NORTHWEST_PLAYERS } from './rosters/northwest';
import { PACIFIC_PLAYERS } from './rosters/pacific';
import { SOUTHWEST_PLAYERS } from './rosters/southwest';

// Master list of all active NBA players across all 30 franchises (15-18 players each, starters + bench + reserves + draft picks)
export const ACTIVE_NBA_PLAYERS: NBAPlayer[] = [
  ...ATLANTIC_PLAYERS,
  ...CENTRAL_PLAYERS,
  ...SOUTHEAST_PLAYERS,
  ...NORTHWEST_PLAYERS,
  ...PACIFIC_PLAYERS,
  ...SOUTHWEST_PLAYERS,
];

// Complete player database including all active NBA rosters and all Iconic/Legendary classic players
export const NBA_PLAYERS_DATA: NBAPlayer[] = [
  ...ACTIVE_NBA_PLAYERS,
  ...ALL_ICON_PLAYERS,
];
