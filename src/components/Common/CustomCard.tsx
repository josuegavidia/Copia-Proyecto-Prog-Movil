import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { NBA_THEME } from '../../theme/colors';

export interface CustomCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const CustomCard: React.FC<CustomCardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  return (
    <View
      style={[
        styles.baseCard,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        variant === 'flat' && styles.flat,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    backgroundColor: NBA_THEME.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: NBA_THEME.border,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  outlined: {
    backgroundColor: '#FFFFFF',
    borderColor: NBA_THEME.borderDark,
  },
  flat: {
    backgroundColor: NBA_THEME.bgCardSecondary,
    borderWidth: 0,
  },
});
