export const getPlayerHeadshotUrl = (nbaPersonId: number): string => {
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${nbaPersonId}.png`;
};

export const getPlayerFallbackHeadshotUrl = (nbaPersonId: number): string => {
  return `https://cdn.nba.com/headshots/nba/latest/260x190/${nbaPersonId}.png`;
};

export const FALLBACK_HEADSHOT_URL = 'https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png';
