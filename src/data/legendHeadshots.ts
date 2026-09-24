// High-resolution verified portraits for historic NBA legends via ESPN / NBA CDNs
export const LEGEND_HEADSHOTS: Record<string, string> = {
  'icon-barkley-788': 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/788.png&w=350&h=254',
  'icon-penny-348': 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/348.png&w=350&h=254',
  'icon-kidd-467': 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/429.png&w=350&h=254',
  'icon-ewing-121': 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/238.png&w=350&h=254',
};

export const getLegendHeadshotUrl = (iconId: string, nbaPersonId: number): string => {
  if (LEGEND_HEADSHOTS[iconId]) {
    return LEGEND_HEADSHOTS[iconId];
  }
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${nbaPersonId}.png`;
};

