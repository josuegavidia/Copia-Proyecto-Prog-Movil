import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import { NBAPlayer } from '../../types';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { RARITY_COLORS } from '../../theme/colors';
import { getPlayerFallbackHeadshotUrl, FALLBACK_HEADSHOT_URL } from '../../utils/imageUtils';
import { getPlayerBio } from '../../data/playerBioData';
import { useTheme } from '../../context/ThemeContext';

interface NBACardProps {
  player: NBAPlayer;
  size?: 'sm' | 'md' | 'lg';
  width?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  showDetailsOnFlip?: boolean;
}

export const NBACard: React.FC<NBACardProps> = ({
  player,
  size = 'md',
  width,
  style,
  onPress,
  showDetailsOnFlip = false,
}) => {
  const { colors, isDark } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgUrl, setImgUrl] = useState<string>(player.imageUrl);

  useEffect(() => {
    setImgUrl(player.imageUrl);
  }, [player.imageUrl]);

  const team = NBA_TEAMS[player.teamAbbr] || {
    primaryColor: '#0284C7',
    secondaryColor: '#38BDF8',
    name: player.team,
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  };

  const rarityConfig = RARITY_COLORS[player.rarity] || RARITY_COLORS.BRONZE;
  const bio = getPlayerBio(player.name, player.position, player.height, player.country, player.countryFlag);

  const defaultCardWidth: DimensionValue = size === 'sm' ? 104 : size === 'md' ? '100%' : 270;
  const cardWidth: DimensionValue = width !== undefined ? width : defaultCardWidth;
  const cardHeight = size === 'sm' ? 148 : size === 'md' ? 224 : 390;

  const handlePress = () => {
    if (showDetailsOnFlip) {
      setIsFlipped(!isFlipped);
    }
    if (onPress) {
      onPress();
    }
  };

  const handleImageError = () => {
    if (player.nbaPersonId) {
      const fallback260 = getPlayerFallbackHeadshotUrl(player.nbaPersonId);
      if (imgUrl !== fallback260 && imgUrl !== FALLBACK_HEADSHOT_URL) {
        setImgUrl(fallback260);
      } else if (imgUrl !== FALLBACK_HEADSHOT_URL) {
        setImgUrl(FALLBACK_HEADSHOT_URL);
      }
    } else if (imgUrl !== FALLBACK_HEADSHOT_URL) {
      setImgUrl(FALLBACK_HEADSHOT_URL);
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
          style,
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

  const isIcon = player.rarity === 'ICON' || player.isLegend;

  // Dynamic colors for legend cards:
  // In Dark Mode: Sleek obsidian/slate background (#141B29) with radiant gold border (#EAB308) - eliminates the harsh blinding white
  // In Light Mode: Soft luxury pearl-ivory (#FFFDF5) with championship gold border (#D4AF37)
  const iconCardBg = isDark ? '#141B29' : '#FFFDF5';
  const iconBorderColor = isDark ? '#EAB308' : '#D4AF37';
  const iconHeaderBg = isDark ? '#1E2738' : '#FEF9C3';
  const iconHeaderBorder = isDark ? '#CA8A04' : '#EAB308';
  const iconOvrColor = isDark ? '#FDE047' : '#B45309';
  const iconPosColor = isDark ? '#F8FAFC' : '#78350F';
  const iconTagBg = isDark ? '#3B2D12' : '#FDE047';
  const iconTagText = isDark ? '#FEF08A' : '#713F12';
  const iconNameBoxBg = isDark ? '#0B0F19' : '#0F172A';
  const iconStatsBarBg = isDark ? '#161F30' : '#FEFCE8';
  const iconStatsBarBorder = isDark ? '#243048' : '#FEF08A';
  const iconStatLabelColor = isDark ? '#94A3B8' : '#854D0E';
  const iconStatValColor = isDark ? '#F8FAFC' : '#0F172A';

  return (
    <TouchableOpacity
      activeOpacity={onPress || showDetailsOnFlip ? 0.85 : 1}
      onPress={handlePress}
      style={[
        styles.cardContainer,
        {
          width: cardWidth,
          height: cardHeight,
          borderColor: isIcon ? iconBorderColor : rarityConfig.border,
          backgroundColor: isIcon ? iconCardBg : rarityConfig.cardBg,
          borderWidth: isIcon ? 2.5 : 2,
          shadowColor: isIcon ? '#CA8A04' : '#000000',
          shadowOffset: { width: 0, height: isIcon ? 4 : 2 },
          shadowOpacity: isIcon ? (isDark ? 0.6 : 0.35) : 0.2,
          shadowRadius: isIcon ? 6 : 3,
          elevation: isIcon ? 6 : 3,
        },
        style,
      ]}
    >
      {/* Top Header Bar with OVR, Position, and Official Team Logo / Classic Tag */}
      <View
        style={[
          styles.headerRow,
          size === 'sm' && styles.headerRowSm,
          {
            backgroundColor: isIcon ? iconHeaderBg : rarityConfig.headerBg,
            borderColor: isIcon ? iconHeaderBorder : 'transparent',
            borderWidth: isIcon ? 1 : 0,
          },
        ]}
      >
        <View style={styles.ovrBadge}>
          <Text
            style={[
              styles.ovrText,
              size === 'sm' && styles.ovrTextSm,
              size === 'lg' && styles.ovrTextLg,
              isIcon && { color: iconOvrColor, fontWeight: '900' },
            ]}
          >
            {player.stats.ovr}
          </Text>
          <Text
            style={[
              styles.posText,
              size === 'sm' && styles.posTextSm,
              size === 'lg' && styles.posTextLg,
              isIcon && { color: iconPosColor, fontWeight: '900' },
            ]}
          >
            {player.position}
          </Text>
        </View>

        {/* Official Team Logo & Tag or Classic Year */}
        <View
          style={[
            styles.teamTag,
            size === 'sm' && styles.teamTagSm,
            { backgroundColor: isIcon ? iconTagBg : rarityConfig.badgeBg },
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
              { color: isIcon ? iconTagText : rarityConfig.badgeText },
            ]}
          >
            {player.classicTeamYear ? player.classicTeamYear : player.teamAbbr}
          </Text>
        </View>
      </View>

      {/* Player Official Headshot */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imgUrl }}
          onError={handleImageError}
          style={[
            styles.playerImage,
            size === 'sm' && styles.playerImageSm,
            size === 'lg' && styles.playerImageLg,
          ]}
          resizeMode="contain"
        />
      </View>

      {/* Player Name and Nickname - Fixed height for identical card geometry */}
      <View
        style={[
          styles.nameContainer,
          size === 'sm' && styles.nameContainerSm,
          size === 'lg' && styles.nameContainerLg,
          {
            backgroundColor: isIcon ? iconNameBoxBg : rarityConfig.nameBoxBg,
            borderColor: isIcon ? '#CA8A04' : 'transparent',
            borderWidth: isIcon ? 1 : 0,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.playerName,
            size === 'sm' && styles.playerNameSm,
            size === 'lg' && styles.playerNameLg,
            isIcon && { color: '#FEF08A' },
          ]}
        >
          {bio.countryFlag} {player.name}
        </Text>
        {size !== 'sm' && (
          <Text numberOfLines={1} style={[styles.playerNickname, isIcon && { color: '#FDE047' }]}>
            {player.nickname ? `"${player.nickname}" · ${bio.height.split(' ')[0]}` : (player.classicTeamYear ? `${player.classicTeamYear} · ${bio.height.split(' ')[0]}` : `${player.teamAbbr} #${player.number} · ${bio.height.split(' ')[0]}`)}
          </Text>
        )}
      </View>

      {/* Bottom Stats Pills */}
      {size !== 'sm' && (
        <View
          style={[
            styles.statsBar,
            {
              backgroundColor: isIcon ? iconStatsBarBg : rarityConfig.headerBg,
              borderColor: isIcon ? iconStatsBarBorder : 'transparent',
              borderWidth: isIcon ? 1 : 0,
            },
          ]}
        >
          <View style={styles.statPill}>
            <Text style={[styles.statLabel, isIcon && { color: iconStatLabelColor }]}>OFF</Text>
            <Text style={[styles.statValue, isIcon && { color: iconStatValColor }]}>{player.stats.offense}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={[styles.statLabel, isIcon && { color: iconStatLabelColor }]}>DEF</Text>
            <Text style={[styles.statValue, isIcon && { color: iconStatValColor }]}>{player.stats.defense}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={[styles.statLabel, isIcon && { color: iconStatLabelColor }]}>3PT</Text>
            <Text style={[styles.statValue, isIcon && { color: iconStatValColor }]}>{player.stats.threePoint}</Text>
          </View>
          {size === 'lg' && (
            <View style={styles.statPill}>
              <Text style={[styles.statLabel, isIcon && { color: iconStatLabelColor }]}>PLY</Text>
              <Text style={[styles.statValue, isIcon && { color: iconStatValColor }]}>{player.stats.playmaking}</Text>
            </View>
          )}
        </View>
      )}

      {/* Rarity Bottom Strip */}
      <View
        style={[
          styles.rarityStrip,
          size === 'sm' && styles.rarityStripSm,
          {
            backgroundColor: isIcon ? '#FEF08A' : rarityConfig.badgeBg,
            borderColor: isIcon ? '#CA8A04' : 'transparent',
            borderWidth: isIcon ? 0.5 : 0,
          },
        ]}
      >
        <Text
          style={[
            styles.rarityLabel,
            size === 'sm' && styles.rarityLabelSm,
            { color: isIcon ? '#713F12' : rarityConfig.badgeText },
          ]}
        >
          {isIcon ? 'ICONO LEYENDA' : rarityConfig.label}
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
    height: 26,
    borderRadius: 4,
    marginBottom: 2,
  },
  headerRowSm: {
    paddingHorizontal: 4,
    height: 20,
    marginBottom: 2,
  },
  ovrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ovrText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ovrTextSm: {
    fontSize: 13,
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
    height: 110,
  },
  playerImageSm: {
    height: 68,
  },
  playerImageLg: {
    height: 210,
  },
  nameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    borderRadius: 4,
    marginBottom: 3,
    paddingHorizontal: 4,
  },
  nameContainerSm: {
    height: 22,
    paddingVertical: 0,
    paddingHorizontal: 3,
    marginBottom: 2,
  },
  nameContainerLg: {
    height: 48,
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
