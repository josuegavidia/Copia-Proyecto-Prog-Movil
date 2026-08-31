import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomCoach } from '../../types';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { THEME } from '../../theme/colors';

interface CustomCoachCardProps {
  coach: CustomCoach;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

export const CustomCoachCard: React.FC<CustomCoachCardProps> = ({
  coach,
  size = 'md',
  onPress,
}) => {
  const team = NBA_TEAMS[coach.teamAffinity] || {
    primaryColor: '#0284C7',
    secondaryColor: '#38BDF8',
    name: 'NBA Coach',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  };

  const cardWidth = size === 'sm' ? 104 : size === 'md' ? 155 : 270;
  const cardHeight = size === 'sm' ? 148 : size === 'md' ? 230 : 390;

  const bgColor = coach.bgColor || '#1E293B';
  
  // Helper to check if color is dark or light for text contrast
  const isColorLight = (hex: string) => {
    if (!hex || hex === 'transparent') return false;
    const clean = hex.replace('#', '');
    if (clean.length < 6) return false;
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 165;
  };

  const isLight = isColorLight(bgColor);
  const textColor = isLight ? '#0F172A' : '#FFFFFF';
  const subtextColor = isLight ? '#475569' : '#CBD5E1';
  const totalBoost = coach.boostOffense + coach.boostDefense;

  const hasPhoto = Boolean(coach.photoUri && coach.photoUri.trim().length > 0);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      style={[
        styles.cardContainer,
        {
          width: cardWidth,
          height: cardHeight,
          borderColor: team.primaryColor,
          backgroundColor: bgColor,
        },
      ]}
    >
      {/* Top Header Bar (Clean NBA Franchise Bar) */}
      <View
        style={[
          styles.headerRow,
          size === 'sm' && styles.headerRowSm,
          { backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.3)' },
        ]}
      >
        <View style={styles.coachTag}>
          <Text
            style={[
              styles.coachTagText,
              size === 'sm' && { fontSize: 8 },
              size === 'lg' && { fontSize: 12 },
              { color: textColor },
            ]}
          >
            COACH
          </Text>
        </View>

        <View style={styles.teamBadge}>
          {team.logoUrl ? (
            <Image
              source={{ uri: team.logoUrl }}
              style={[
                styles.teamLogo,
                size === 'sm' && styles.teamLogoSm,
                size === 'lg' && styles.teamLogoLg,
              ]}
              resizeMode="contain"
            />
          ) : null}
          <Text
            style={[
              styles.teamAbbr,
              size === 'sm' && styles.teamAbbrSm,
              size === 'lg' && styles.teamAbbrLg,
              { color: textColor },
            ]}
          >
            {coach.teamAffinity}
          </Text>
        </View>
      </View>

      {/* Head Coach Portrait (Clean Face & Cutout View or Vector Icon) */}
      <View style={styles.imageContainer}>
        {hasPhoto ? (
          <Image
            source={{ uri: coach.photoUri }}
            style={[
              styles.coachImage,
              size === 'sm' && styles.coachImageSm,
              size === 'lg' && styles.coachImageLg,
            ]}
            resizeMode={coach.photoUri.startsWith('data:image/png') ? 'contain' : 'cover'}
          />
        ) : (
          <View
            style={[
              styles.placeholderIconBox,
              size === 'sm' && styles.placeholderIconBoxSm,
              size === 'lg' && styles.placeholderIconBoxLg,
              {
                backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              },
            ]}
          >
            <Ionicons
              name="person"
              size={size === 'sm' ? 44 : size === 'md' ? 70 : 120}
              color={isLight ? '#64748B' : '#94A3B8'}
            />
          </View>
        )}
      </View>

      {/* Coach Bottom Bar: Clean Coach Name (Identical to Player Name Bar) */}
      <View
        style={[
          styles.bottomBanner,
          {
            backgroundColor: isLight
              ? 'rgba(255, 255, 255, 0.92)'
              : 'rgba(15, 23, 42, 0.90)',
            borderTopColor: team.primaryColor,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.coachName,
            size === 'sm' && styles.coachNameSm,
            size === 'lg' && styles.coachNameLg,
            { color: textColor },
          ]}
        >
          {coach.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerRowSm: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  coachTag: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 107, 182, 0.15)',
  },
  coachTagText: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  teamLogo: {
    width: 16,
    height: 16,
  },
  teamLogoSm: {
    width: 12,
    height: 12,
  },
  teamLogoLg: {
    width: 24,
    height: 24,
  },
  teamAbbr: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  teamAbbrSm: {
    fontSize: 8.5,
  },
  teamAbbrLg: {
    fontSize: 14,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    overflow: 'hidden',
  },
  coachImage: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  coachImageSm: {
    width: '88%',
    height: '88%',
    borderRadius: 8,
  },
  coachImageLg: {
    width: '92%',
    height: '92%',
    borderRadius: 14,
  },
  placeholderIconBox: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIconBoxSm: {
    width: '88%',
    height: '88%',
    borderRadius: 8,
  },
  placeholderIconBoxLg: {
    width: '92%',
    height: '92%',
    borderRadius: 14,
  },
  bottomBanner: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    alignItems: 'center',
    borderTopWidth: 1.5,
  },
  coachName: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  coachNameSm: {
    fontSize: 9.5,
  },
  coachNameLg: {
    fontSize: 18,
    marginBottom: 2,
  },
  tacticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 2,
  },
  tacticText: {
    fontSize: 8.5,
    fontWeight: 'bold',
  },
  boostPill: {
    backgroundColor: 'rgba(0, 107, 182, 0.12)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  boostPillText: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#006BB6',
  },
});
