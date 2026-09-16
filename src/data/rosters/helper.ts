import { NBAPlayer, CardRarity, Position, Conference, UnitType } from '../../types';

export const headshot = (id: number | string) =>
  `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`;

export const determineRarity = (ovr: number): CardRarity => {
  if (ovr >= 93) return 'DIAMOND';
  if (ovr >= 85) return 'GOLD';
  if (ovr >= 78) return 'SILVER';
  return 'BRONZE';
};

export const createPlayer = (
  id: string,
  nbaPersonId: number,
  name: string,
  team: string,
  teamAbbr: string,
  conference: Conference,
  position: Position,
  secondaryPosition: Position | undefined,
  number: number,
  ovr: number,
  offense: number,
  defense: number,
  threePoint: number,
  dunk: number,
  speed: number,
  playmaking: number,
  rebound: number,
  unitType: UnitType = 'STARTER',
  nickname?: string
): NBAPlayer => ({
  id,
  nbaPersonId,
  name,
  nickname,
  team,
  teamAbbr,
  conference,
  position,
  secondaryPosition,
  number,
  unitType,
  rarity: determineRarity(ovr),
  stats: {
    ovr,
    offense,
    defense,
    threePoint,
    dunk,
    speed,
    playmaking,
    rebound,
  },
  imageUrl: headshot(nbaPersonId),
});
