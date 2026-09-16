// High-resolution verified portraits for historic NBA legends via official NBA CDN
export const LEGEND_HEADSHOTS: Record<string, string> = {};

export const getLegendHeadshotUrl = (iconId: string, nbaPersonId: number): string => {
  if (LEGEND_HEADSHOTS[iconId]) {
    return LEGEND_HEADSHOTS[iconId];
  }
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${nbaPersonId}.png`;
};

