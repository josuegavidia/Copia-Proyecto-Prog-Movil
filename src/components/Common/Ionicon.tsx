import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export interface IoniconProps {
  name: string;
  size?: number;
  color?: string;
}

export const Ionicon: React.FC<IoniconProps> = ({
  name,
  size = 14,
  color = '#0F172A',
}) => {
  // Mapear nombres comunes a glifos válidos de Ionicons de @expo/vector-icons
  let glyph: keyof typeof Ionicons.glyphMap = 'sparkles';

  switch (name) {
    case 'flame':
      glyph = 'flame';
      break;
    case 'flash':
      glyph = 'flash';
      break;
    case 'globe-outline':
    case 'globe':
      glyph = 'globe-outline';
      break;
    case 'shirt-outline':
    case 'shirt':
      glyph = 'shirt-outline';
      break;
    case 'ribbon-outline':
    case 'award':
      glyph = 'ribbon-outline';
      break;
    case 'alert-circle-outline':
      glyph = 'alert-circle-outline';
      break;
    case 'information-circle-outline':
      glyph = 'information-circle-outline';
      break;
    case 'sparkles':
      glyph = 'sparkles';
      break;
    case 'shield-checkmark':
    case 'shield':
      glyph = 'shield-checkmark-outline';
      break;
    case 'person':
      glyph = 'person-outline';
      break;
    case 'trophy':
      glyph = 'trophy-outline';
      break;
    case 'basketball':
      glyph = 'basketball-outline';
      break;
    default:
      if (name in Ionicons.glyphMap) {
        glyph = name as keyof typeof Ionicons.glyphMap;
      }
      break;
  }

  return <Ionicons name={glyph} size={size} color={color} />;
};
