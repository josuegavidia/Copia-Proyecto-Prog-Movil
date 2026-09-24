export const getPlayerHeadshotUrl = (nbaPersonId: number | string): string => {
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${nbaPersonId}.png&w=350&h=254`;
};

export const getPlayerFallbackHeadshotUrl = (nbaPersonId: number | string): string => {
  return `https://a.espncdn.com/i/headshots/nba/players/full/${nbaPersonId}.png`;
};

export const FALLBACK_HEADSHOT_URL = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/fallback.png&w=350&h=254';
