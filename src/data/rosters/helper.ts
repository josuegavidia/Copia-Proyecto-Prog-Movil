import { NBAPlayer, CardRarity, Position, Conference, UnitType } from '../../types';
import { getPlayerBio } from '../playerBioData';

export const headshot = (id: number | string) =>
  `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${id}.png&w=350&h=254`;

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
): NBAPlayer => {
  const bio = getPlayerBio(name, position);
  return {
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
    height: bio.height,
    country: bio.country,
    countryFlag: bio.countryFlag,
  };
};
