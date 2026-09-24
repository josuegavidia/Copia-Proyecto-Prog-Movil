export interface ThemeColors {
  nbaNavy: string;
  nbaNavyDark: string;
  nbaNavyLight: string;
  nbaRed: string;
  nbaRedDark: string;
  nbaRedLight: string;
  nbaGold: string;
  nbaGoldDark: string;
  nbaGoldLight: string;
  bg: string;
  bgCard: string;
  bgCardSecondary: string;
  border: string;
  borderDark: string;
  text: string;
  textDark: string;
  textMuted: string;
  textLight: string;
  tabBarBg: string;
  tabBarBorder: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  primary: string;
  secondary: string;
  accent: string;
}

export const LIGHT_THEME: ThemeColors = {
  // Official NBA Identity Colors
  nbaNavy: '#1D428A',
  nbaNavyDark: '#122A58',
  nbaNavyLight: '#EBF3FF',
  nbaRed: '#C8102E',
  nbaRedDark: '#990B21',
  nbaRedLight: '#FEE2E2',
  nbaGold: '#D97706',
  nbaGoldDark: '#B45309',
  nbaGoldLight: '#FEF3C7',

  // Clean Light Palette
  bg: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgCardSecondary: '#F1F5F9',
  border: '#E2E8F0',
  borderDark: '#CBD5E1',

  // Text
  text: '#0F172A',
  textDark: '#0F172A',
  textMuted: '#64748B',
  textLight: '#FFFFFF',

  // Tab Bar
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#E2E8F0',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0284C7',

  primary: '#1D428A',
  secondary: '#C8102E',
  accent: '#D97706',
};

export const DARK_THEME: ThemeColors = {
  // Premium NBA Dark Identity Colors
  nbaNavy: '#3B82F6',
  nbaNavyDark: '#1D428A',
  nbaNavyLight: '#1E293B',
  nbaRed: '#EF4444',
  nbaRedDark: '#B91C1C',
  nbaRedLight: '#450A0A',
  nbaGold: '#F59E0B',
  nbaGoldDark: '#D97706',
  nbaGoldLight: '#451A03',

  // Sleek Dark Palette
  bg: '#0B0F19',
  bgCard: '#151D2E',
  bgCardSecondary: '#1E293B',
  border: '#1E293B',
  borderDark: '#334155',

  // Text
  text: '#F8FAFC',
  textDark: '#F8FAFC',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',

  // Tab Bar
  tabBarBg: '#0F172A',
  tabBarBorder: '#1E293B',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',

  primary: '#3B82F6',
  secondary: '#EF4444',
  accent: '#F59E0B',
};

// Default backwards compatibility
export const NBA_THEME = LIGHT_THEME;
export const THEME = LIGHT_THEME;

// Vibrant, distinctive solid colors for each rarity
export const RARITY_COLORS = {
  ICON: {
    border: '#D4AF37', // Championship Luxury Gold
    cardBg: '#FFFDF5', // Warm Pearl Ivory (softer than harsh stark white)
    headerBg: '#FEF9C3', // Pale Gold Tint
    nameBoxBg: '#0F172A', // Dark Navy Box
    badgeBg: '#FEF08A', // Vibrant Gold Tag
    text: '#FFFFFF', // High-contrast White Text
    ovrText: '#CA8A04', // Deep Gold OVR
    subText: '#FEF08A', // Gold Subtext
    badgeText: '#854D0E',
    label: 'ICONO',
    glowColor: 'rgba(202, 138, 4, 0.35)',
  },
  DIAMOND: {
    border: '#0284C7', // Electric Blue
    cardBg: '#0284C7', // Strong Solid Cyan/Blue
    headerBg: '#0369A1',
    nameBoxBg: '#0C4A6E',
    badgeBg: '#38BDF8',
    text: '#FFFFFF',
    ovrText: '#FFFFFF',
    subText: '#E0F2FE',
    badgeText: '#082F49',
    label: 'DIAMANTE',
  },
  GOLD: {
    border: '#CA8A04', // Metallic Gold
    cardBg: '#EAB308', // Solid Vibrant Gold
    headerBg: '#CA8A04',
    nameBoxBg: '#854D0E',
    badgeBg: '#FEF08A',
    text: '#FFFFFF',
    ovrText: '#FFFFFF',
    subText: '#FEF9C3',
    badgeText: '#713F12',
    label: 'ORO',
  },
  SILVER: {
    border: '#475569', // Slate Silver
    cardBg: '#94A3B8', // Solid Silver Gray
    headerBg: '#64748B',
    nameBoxBg: '#334155',
    badgeBg: '#E2E8F0',
    text: '#FFFFFF',
    ovrText: '#FFFFFF',
    subText: '#F1F5F9',
    badgeText: '#1E293B',
    label: 'PLATA',
  },
  BRONZE: {
    border: '#9A3412', // Dark Copper
    cardBg: '#C2410C', // Solid Copper Bronze
    headerBg: '#9A3412',
    nameBoxBg: '#7C2D12',
    badgeBg: '#FFEDD5',
    text: '#FFFFFF',
    ovrText: '#FFFFFF',
    subText: '#FFEDD5',
    badgeText: '#7C2D12',
    label: 'BRONCE',
  },
};
