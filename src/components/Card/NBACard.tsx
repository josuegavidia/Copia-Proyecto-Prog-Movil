import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NBAPlayer } from '../../types';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { RARITY_COLORS } from '../../theme/colors';

interface NBACardProps {
  player: NBAPlayer;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  showDetailsOnFlip?: boolean;
}

export const NBACard: React.FC<NBACardProps> = ({
  player,
  size = 'md',
  onPress,
  showDetailsOnFlip = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const team = NBA_TEAMS[player.teamAbbr] || {
    primaryColor: '#0284C7',
    secondaryColor: '#38BDF8',
    name: player.team,
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  };

  const rarityConfig = RARITY_COLORS[player.rarity] || RARITY_COLORS.BRONZE;

  const cardWidth = size === 'sm' ? 104 : size === 'md' ? 155 : 270;
  const cardHeight = size === 'sm' ? 148 : size === 'md' ? 230 : 390;

  const handlePress = () => {
    if (showDetailsOnFlip) {
      setIsFlipped(!isFlipped);
    }
    if (onPress) {
      onPress();
    }
  };

  if (isFlipped && size === 'lg') {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={[
          styles.cardContainer,
          {
            width: cardWidth,
            height: cardHeight,
            borderColor: rarityConfig.border,
            backgroundColor: rarityConfig.cardBg,
          },
        ]}
      >
        <View style={styles.backHeader}>
          <Text style={styles.backPlayerName}>{player.name}</Text>
          <Text style={styles.backTeamName}>
            #{player.number} · {player.team} ({player.conference})
          </Text>
        </View>

        <View style={styles.backStatsContainer}>
          <Text style={styles.backSectionTitle}>ATRIBUTOS COMPLETOS</Text>

          <View style={styles.backStatRow}>
            <Text style={styles.backStatLabel}>Triple (3PT):</Text>
            <Text style={styles.backStatVal}>{player.stats.threePoint}</Text>
          </View>
          <View style={styles.backStatRow}>
            <Text style={styles.backStatLabel}>Clavada (DNK):</Text>
            <Text style={styles.backStatVal}>{player.stats.dunk}</Text>
          </View>
          <View style={styles.backStatRow}>
            <Text style={styles.backStatLabel}>Velocidad (SPD):</Text>
            <Text style={styles.backStatVal}>{player.stats.speed}</Text>
          </View>
          <View style={styles.backStatRow}>
            <Text style={styles.backStatLabel}>Defensa (DEF):</Text>
            <Text style={styles.backStatVal}>{player.stats.defense}</Text>
          </View>
          <View style={styles.backStatRow}>
            <Text style={styles.backStatLabel}>Pase (PLY):</Text>
            <Text style={styles.backStatVal}>{player.stats.playmaking}</Text>
          </View>
          <View style={styles.backStatRow}>
            <Text style={styles.backStatLabel}>Rebote (REB):</Text>
            <Text style={styles.backStatVal}>{player.stats.rebound}</Text>
          </View>
        </View>

        <View style={styles.backFooter}>
          <Text style={styles.tapToFlip}>Toca para volver al frente</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={onPress || showDetailsOnFlip ? 0.85 : 1}
      onPress={handlePress}
      style={[
        styles.cardContainer,
        {
          width: cardWidth,
          height: cardHeight,
          borderColor: rarityConfig.border,
          backgroundColor: rarityConfig.cardBg,
        },
      ]}
    >
      {/* Top Header Bar with OVR, Position, and Official Team Logo */}
      <View
        style={[
          styles.headerRow,
          size === 'sm' && styles.headerRowSm,
          { backgroundColor: rarityConfig.headerBg },
        ]}
      >
        <View style={styles.ovrBadge}>
          <Text
            style={[
              styles.ovrText,
              size === 'sm' && styles.ovrTextSm,
              size === 'lg' && styles.ovrTextLg,
            ]}
          >
            {player.stats.ovr}
          </Text>
          <Text
            style={[
              styles.posText,
              size === 'sm' && styles.posTextSm,
              size === 'lg' && styles.posTextLg,
            ]}
          >
            {player.position}
          </Text>
        </View>

        {/* Official Team Logo & Tag */}
        <View
          style={[
            styles.teamTag,
            size === 'sm' && styles.teamTagSm,
            { backgroundColor: rarityConfig.badgeBg },
          ]}
        >
          {team.logoUrl && (
            <Image
              source={{ uri: team.logoUrl }}
              style={[
                styles.teamLogo,
                size === 'sm' && styles.teamLogoSm,
                size === 'lg' && styles.teamLogoLg,
              ]}
              resizeMode="contain"
            />
          )}
          <Text
            style={[
              styles.teamTagText,
              size === 'sm' && styles.teamTagTextSm,
              { color: rarityConfig.badgeText },
            ]}
          >
            {player.teamAbbr}
          </Text>
        </View>
      </View>

      {/* Player Official Headshot */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: player.imageUrl }}
          style={[
            styles.playerImage,
            size === 'sm' && styles.playerImageSm,
            size === 'lg' && styles.playerImageLg,
          ]}
          resizeMode="contain"
        />
      </View>

      {/* Player Name and Nickname */}
      <View
        style={[
          styles.nameContainer,
          size === 'sm' && styles.nameContainerSm,
          { backgroundColor: rarityConfig.nameBoxBg },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.playerName,
            size === 'sm' && styles.playerNameSm,
            size === 'lg' && styles.playerNameLg,
          ]}
        >
          {player.name}
        </Text>
        {size !== 'sm' && player.nickname && (
          <Text numberOfLines={1} style={styles.playerNickname}>
            "{player.nickname}"
          </Text>
        )}
      </View>

      {/* Bottom Stats Pills */}
      {size !== 'sm' && (
        <View
          style={[
            styles.statsBar,
            { backgroundColor: rarityConfig.headerBg },
          ]}
        >
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>OFF</Text>
            <Text style={styles.statValue}>{player.stats.offense}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>DEF</Text>
            <Text style={styles.statValue}>{player.stats.defense}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>3PT</Text>
            <Text style={styles.statValue}>{player.stats.threePoint}</Text>
          </View>
          {size === 'lg' && (
            <View style={styles.statPill}>
              <Text style={styles.statLabel}>PLY</Text>
              <Text style={styles.statValue}>{player.stats.playmaking}</Text>
            </View>
          )}
        </View>
      )}

      {/* Rarity Bottom Strip */}
      <View
        style={[
          styles.rarityStrip,
          size === 'sm' && styles.rarityStripSm,
          { backgroundColor: rarityConfig.badgeBg },
        ]}
      >
        <Text
          style={[
            styles.rarityLabel,
            size === 'sm' && styles.rarityLabelSm,
            { color: rarityConfig.badgeText },
          ]}
        >
          {rarityConfig.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    borderWidth: 2,
    overflow: 'hidden',
    padding: 5,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 2,
  },
  headerRowSm: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 2,
  },
  ovrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ovrText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ovrTextSm: {
    fontSize: 13.5,
    fontWeight: '900',
  },
  ovrTextLg: {
    fontSize: 28,
  },
  posText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  posTextSm: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  posTextLg: {
    fontSize: 14,
  },
  teamTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  teamTagSm: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
    gap: 2.5,
  },
  teamLogo: {
    width: 16,
    height: 16,
  },
  teamLogoSm: {
    width: 13,
    height: 13,
  },
  teamLogoLg: {
    width: 24,
    height: 24,
  },
  teamTagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  teamTagTextSm: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
  },
  playerImage: {
    width: '100%',
    height: 115,
  },
  playerImageSm: {
    height: 72,
  },
  playerImageLg: {
    height: 210,
  },
  nameContainer: {
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 3,
    paddingHorizontal: 4,
  },
  nameContainerSm: {
    paddingVertical: 2,
    paddingHorizontal: 3,
    marginBottom: 2,
  },
  playerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerNameSm: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerNameLg: {
    fontSize: 16,
  },
  playerNickname: {
    fontSize: 9.5,
    color: '#E0F2FE',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 4,
    paddingVertical: 3,
    marginBottom: 2,
  },
  statPill: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
    opacity: 0.85,
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rarityStrip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    borderRadius: 3,
  },
  rarityStripSm: {
    paddingVertical: 1.5,
  },
  rarityLabel: {
    fontSize: 8.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rarityLabelSm: {
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Back of card
  backHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 6,
  },
  backPlayerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backTeamName: {
    fontSize: 12,
    color: '#E0F2FE',
    marginTop: 2,
  },
  backStatsContainer: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
  backSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  backStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    marginVertical: 2,
  },
  backStatLabel: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  backStatVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backFooter: {
    alignItems: 'center',
    paddingTop: 6,
  },
  tapToFlip: {
    fontSize: 11,
    color: '#E0F2FE',
  },
});
