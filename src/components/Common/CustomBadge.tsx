import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NBA_THEME } from '../../theme/colors';

export type BadgeVariant = 'navy' | 'red' | 'gold' | 'success' | 'warning' | 'neutral';

export interface CustomBadgeProps {
  label: string;
  variant?: BadgeVariant;
  iconName?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const CustomBadge: React.FC<CustomBadgeProps> = ({
  label,
  variant = 'neutral',
  iconName,
  size = 'md',
  style,
  textStyle,
}) => {
  const getBadgeColors = (): { bg: string; text: string; border: string } => {
    switch (variant) {
      case 'navy':
        return { bg: NBA_THEME.nbaNavyLight, text: NBA_THEME.nbaNavy, border: '#BFDBFE' };
      case 'red':
        return { bg: NBA_THEME.nbaRedLight, text: NBA_THEME.nbaRed, border: '#FECACA' };
      case 'gold':
        return { bg: NBA_THEME.nbaGoldLight, text: NBA_THEME.nbaGoldDark, border: '#FDE68A' };
      case 'success':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
      case 'warning':
        return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
      case 'neutral':
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const colors = getBadgeColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 6 : 10,
        },
        style,
      ]}
    >
      {iconName && (
        <Ionicons
          name={iconName}
          size={isSm ? 11 : 13}
          color={colors.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.badgeText,
          {
            color: colors.text,
            fontSize: isSm ? 10 : 12,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
