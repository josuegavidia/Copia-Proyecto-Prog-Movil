import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NBA_THEME } from '../../theme/colors';
import { HapticsService } from '../../services/haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'nbaGold';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconName,
  iconPosition = 'left',
  iconSize,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    HapticsService.selectionTick().catch(() => {});
    onPress();
  };

  // Determinar estilos condicionales basados en la variante
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; iconColor: string } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: NBA_THEME.bgCardSecondary,
            borderColor: NBA_THEME.borderDark,
            borderWidth: 1,
          },
          text: { color: NBA_THEME.textDark },
          iconColor: NBA_THEME.textDark,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: NBA_THEME.nbaRed,
          },
          text: { color: '#FFFFFF' },
          iconColor: '#FFFFFF',
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: NBA_THEME.nbaNavy,
            borderWidth: 1.5,
          },
          text: { color: NBA_THEME.nbaNavy },
          iconColor: NBA_THEME.nbaNavy,
        };
      case 'nbaGold':
        return {
          container: {
            backgroundColor: NBA_THEME.nbaGold,
          },
          text: { color: '#FFFFFF' },
          iconColor: '#FFFFFF',
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: NBA_THEME.nbaNavy,
          },
          text: { color: '#FFFFFF' },
          iconColor: '#FFFFFF',
        };
    }
  };

  // Determinar tamaño condicional
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle; defaultIconSize: number } => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
          text: { fontSize: 13, fontWeight: '600' },
          defaultIconSize: 16,
        };
      case 'lg':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 14 },
          text: { fontSize: 17, fontWeight: '700' },
          defaultIconSize: 22,
        };
      case 'md':
      default:
        return {
          container: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
          text: { fontSize: 15, fontWeight: '700' },
          defaultIconSize: 18,
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();
  const currentIconSize = iconSize || sizeStyle.defaultIconSize;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabledContainer,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.iconColor}
          style={styles.indicator}
        />
      ) : (
        <View style={styles.contentRow}>
          {iconName && iconPosition === 'left' && (
            <Ionicons
              name={iconName}
              size={currentIconSize}
              color={disabled ? NBA_THEME.textMuted : variantStyle.iconColor}
              style={styles.iconLeft}
            />
          )}

          <Text
            style={[
              styles.baseText,
              variantStyle.text,
              sizeStyle.text,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>

          {iconName && iconPosition === 'right' && (
            <Ionicons
              name={iconName}
              size={currentIconSize}
              color={disabled ? NBA_THEME.textMuted : variantStyle.iconColor}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  baseText: {
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabledContainer: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: '#94A3B8',
  },
  indicator: {
    paddingVertical: 2,
  },
});
