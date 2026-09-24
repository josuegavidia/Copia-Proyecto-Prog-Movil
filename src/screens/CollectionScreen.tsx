import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { UserCard, NBAPlayer, ClassicTeam } from '../types';
import { NBA_PLAYERS_DATA, ACTIVE_NBA_PLAYERS } from '../data/nbaPlayers';
import { ALL_ICON_PLAYERS, CLASSIC_TEAMS } from '../data/classicTeams';
import { NBA_TEAMS } from '../data/nbaTeams';
import { NBACard } from '../components/Card/NBACard';
import { PlayerDetailModal } from '../components/Card/PlayerDetailModal';
import { HapticsService } from '../services/haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAchievementsModalVisible, recycleDuplicates } from '../store/slices/squadSlice';
import { useTranslation } from '../i18n/useTranslation';
import { getCardRecycleValue } from '../data/packs';
import { useTheme } from '../context/ThemeContext';

interface CollectionScreenProps {
  cards?: UserCard[];
  onRecycleDuplicates?: (recycledCoins: number) => void;
  onDeleteCard?: (playerId: string) => void;
}

type ViewCategory = 'EAST' | 'WEST' | 'TEAMS' | 'LEGENDS' | 'ALL';

export const CollectionScreen: React.FC<CollectionScreenProps> = ({
  cards: propsCards,
  onRecycleDuplicates,
  onDeleteCard,
}) => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const reduxCards = useAppSelector((state) => state.squad.cards);
  const cards = propsCards || reduxCards;

  const { t, language } = useTranslation();
  const [currentCategory, setCurrentCategory] = useState<ViewCategory>('EAST');
  const [selectedTeamAbbr, setSelectedTeamAbbr] = useState<string | null>(null);
  const [selectedClassicTeamId, setSelectedClassicTeamId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedPlayer, setInspectedPlayer] = useState<NBAPlayer | null>(null);

  // Map of collected players by canonical player id
  const collectedMap = new Map<string, UserCard>();
  cards.forEach((c) => {
    const key = c.player?.id || c.playerId;
    if (key && !collectedMap.has(key)) {
      collectedMap.set(key, c);
    }
  });

  const totalMasterCount = NBA_PLAYERS_DATA.length;
  const uniqueCount = collectedMap.size;
  const progressPercent = Math.round((uniqueCount / totalMasterCount) * 100);

  // Duplicate calculation by card rarity
  const seenPlayerIds = new Set<string>();
  const duplicateCards: UserCard[] = [];
  cards.forEach((c) => {
    const key = c.playerId || c.player?.id;
    if (key) {
      if (seenPlayerIds.has(key)) {
        duplicateCards.push(c);
      } else {
        seenPlayerIds.add(key);
      }
    }
  });

  const duplicateCount = duplicateCards.length;
  const duplicateCoinsTotal = duplicateCards.reduce((acc, c) => {
    const rarity = c.player?.rarity || 'BRONZE';
    return acc + getCardRecycleValue(rarity);
  }, 0);

  const handleRecycleDuplicates = async () => {
    if (duplicateCount === 0) {
      Alert.alert('Sin Duplicados', 'No tienes cartas duplicadas en tu inventario.');
      return;
    }

    await HapticsService.selectionTick();
    const coinsEarned = duplicateCoinsTotal;

    Alert.alert(
      'Reciclar Duplicados',
      `¿Deseas reciclar ${duplicateCount} carta(s) repetida(s) a cambio de +${coinsEarned.toLocaleString()} monedas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: `Reciclar (+${coinsEarned.toLocaleString()})`,
          onPress: async () => {
            await HapticsService.celebrate();
            if (onRecycleDuplicates) {
              onRecycleDuplicates(coinsEarned);
            } else {
              await dispatch(recycleDuplicates(coinsEarned));
            }
          },
        },
      ]
    );
  };

  const handleCategoryChange = async (cat: ViewCategory) => {
    await HapticsService.selectionTick();
    setCurrentCategory(cat);
    setSelectedTeamAbbr(null);
    setSelectedClassicTeamId(null);
  };

  const handleSelectTeam = async (abbr: string) => {
    await HapticsService.selectionTick();
    setSelectedTeamAbbr(abbr);
  };

  const getTeamsList = () => {
    const allTeams = Object.values(NBA_TEAMS);
    if (currentCategory === 'EAST') {
      return allTeams.filter((t) => t.conference === 'Eastern');
    }
    if (currentCategory === 'WEST') {
      return allTeams.filter((t) => t.conference === 'Western');
    }
    return allTeams;
  };

  const activeTeam = selectedTeamAbbr ? NBA_TEAMS[selectedTeamAbbr] : null;

  // Render Team Album View (Franchise 10 players)
  const renderTeamAlbum = (teamAbbr: string) => {
    const team = NBA_TEAMS[teamAbbr];
    const teamPlayers = ACTIVE_NBA_PLAYERS.filter((p) => p.teamAbbr === teamAbbr);
    const collectedForTeam = teamPlayers.filter((p) => collectedMap.has(p.id));

    return (
      <View
        style={[
          styles.teamAlbumContainer,
          { backgroundColor: team.primaryColor ? `${team.primaryColor}18` : '#F8FAFC' },
        ]}
      >
        <View
          style={[
            styles.teamAlbumBanner,
            { backgroundColor: team.primaryColor || '#0284C7' },
          ]}
        >
          <TouchableOpacity
            onPress={() => setSelectedTeamAbbr(null)}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            <Text style={styles.backBtnText}>Volver a Franquicias</Text>
          </TouchableOpacity>

          <View style={styles.teamBannerMain}>
            <Image
              source={{ uri: team.logoUrl }}
              style={styles.bannerTeamLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.bannerTeamName}>{team.name}</Text>
              <Text style={styles.bannerTeamStats}>
                {collectedForTeam.length} de {teamPlayers.length} Coleccionados ({Math.round((collectedForTeam.length / teamPlayers.length) * 100)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Player Slots Grid */}
        <FlatList
          data={teamPlayers}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.teamGrid}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => {
            const isUnlocked = collectedMap.has(item.id);

            if (isUnlocked) {
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    HapticsService.selectionTick();
                    setInspectedPlayer(item);
                  }}
                  style={styles.unlockedCardSlot}
                >
                  <View pointerEvents="none">
                    <NBACard player={item} size="md" />
                  </View>
                </TouchableOpacity>
              );
            }

            // Locked Slot (Can also be tapped to inspect player dossier)
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  HapticsService.selectionTick();
                  setInspectedPlayer(item);
                }}
                style={[styles.lockedCardSlot, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
              >
                <View style={[styles.lockedCardHeader, { backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9' }]}>
                  <Text style={[styles.lockedOvrText, { color: colors.textMuted }]}>{item.stats.ovr}</Text>
                  <Text style={[styles.lockedPosText, { color: colors.textMuted }]}>{item.position}</Text>
                  <Text style={[styles.lockedUnitTag, { color: colors.textMuted, backgroundColor: isDark ? colors.border : '#E2E8F0' }]}>
                    {item.unitType === 'STARTER' ? 'TITULAR' : 'SUPLENTE'}
                  </Text>
                </View>

                <View style={styles.lockedSilhouetteBox}>
                  <Ionicons name="person" size={54} color={isDark ? '#334155' : '#CBD5E1'} />
                  <Ionicons name="lock-closed" size={20} color={isDark ? '#64748B' : '#64748B'} style={styles.lockIconOverlay} />
                </View>

                <Text numberOfLines={1} style={[styles.lockedPlayerName, { color: colors.textMuted }]}>
                  {item.name}
                </Text>

                <View
                  style={[
                    styles.lockedFooter,
                    { backgroundColor: team.primaryColor ? `${team.primaryColor}22` : isDark ? colors.bgCardSecondary : '#F1F5F9' },
                  ]}
                >
                  <Text style={[styles.lockedHelpText, { color: team.primaryColor || colors.text }]}>
                    Toca para ver Ficha
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  // Render Legends Album View (Equipos Iconos & Quintetos Históricos)
  const renderLegendsAlbum = () => {
    // 1. Single Classic Quinteto view
    if (selectedClassicTeamId) {
      const classicTeam = CLASSIC_TEAMS.find((t) => t.id === selectedClassicTeamId);
      if (!classicTeam) return null;

      const collectedForQuinteto = classicTeam.starters.filter((p) => collectedMap.has(p.id));

      return (
        <View style={[styles.teamAlbumContainer, { backgroundColor: isDark ? colors.bg : '#FEFCE8' }]}>
          <View style={[styles.teamAlbumBanner, { backgroundColor: isDark ? '#1E293B' : '#854D0E' }]}>
            <TouchableOpacity
              onPress={() => setSelectedClassicTeamId(null)}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              <Text style={styles.backBtnText}>Volver a Equipos Iconos</Text>
            </TouchableOpacity>

            <View style={styles.teamBannerMain}>
              <Image
                source={{ uri: classicTeam.logoUrl }}
                style={styles.bannerTeamLogo}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.bannerTeamName}>{classicTeam.name}</Text>
                  <View style={[styles.classicTeamOvrBadge, isDark && { backgroundColor: '#2E2210', borderColor: '#CA8A04' }]}>
                    <Ionicons name="flash" size={10} color={isDark ? '#FDE047' : '#78350F'} />
                    <Text style={[styles.classicTeamOvrText, isDark && { color: '#FEF08A' }]}>{classicTeam.ovr} OVR</Text>
                  </View>
                </View>
                <Text style={styles.bannerTeamStats}>
                  {collectedForQuinteto.length} de 5 Titulares Coleccionados ({Math.round((collectedForQuinteto.length / 5) * 100)}%)
                </Text>
                <Text numberOfLines={2} style={styles.classicTeamDescHeader}>
                  {classicTeam.description}
                </Text>
              </View>
            </View>
          </View>

          {/* 5 Starters Grid */}
          <FlatList
            data={classicTeam.starters}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.teamGrid}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => {
              const isUnlocked = collectedMap.has(item.id);

              if (isUnlocked) {
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      HapticsService.selectionTick();
                      setInspectedPlayer(item);
                    }}
                    style={styles.unlockedCardSlot}
                  >
                    <View pointerEvents="none">
                      <NBACard player={item} size="md" />
                    </View>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    HapticsService.selectionTick();
                    setInspectedPlayer(item);
                  }}
                  style={[
                    styles.lockedCardSlot,
                    styles.lockedLegendCardSlot,
                    isDark && { backgroundColor: '#141B29', borderColor: '#B45309' },
                  ]}
                >
                  <View style={[styles.lockedCardHeader, { backgroundColor: isDark ? '#1E2738' : '#FEF9C3' }]}>
                    <Text style={[styles.lockedOvrText, { color: isDark ? '#FBBF24' : '#B45309' }]}>{item.stats.ovr}</Text>
                    <Text style={[styles.lockedPosText, { color: isDark ? '#FDE68A' : '#78350F' }]}>{item.position}</Text>
                    <Text style={[styles.lockedUnitTag, { color: isDark ? '#FEF08A' : '#854D0E', backgroundColor: isDark ? '#451A03' : '#FEF08A' }]}>
                      {item.classicTeamYear || 'ICONO'}
                    </Text>
                  </View>

                  <View style={styles.lockedSilhouetteBox}>
                    <Ionicons name="trophy" size={48} color={isDark ? '#78350F' : '#FEF08A'} />
                    <Ionicons name="lock-closed" size={18} color={isDark ? '#F59E0B' : '#B45309'} style={styles.lockIconOverlay} />
                  </View>

                  <Text numberOfLines={1} style={[styles.lockedPlayerName, { color: isDark ? '#E2E8F0' : '#78350F' }]}>
                    {item.name}
                  </Text>

                  <View style={[styles.lockedFooter, { backgroundColor: isDark ? '#1E2738' : '#FEF9C3' }]}>
                    <Text style={[styles.lockedHelpText, { color: isDark ? '#FDE047' : '#854D0E' }]}>
                      Toca para ver Ficha
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      );
    }

    // List of Legends (All 50 All-Time Icons)
    let legendsList = ALL_ICON_PLAYERS;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      legendsList = legendsList.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          p.teamAbbr.toLowerCase().includes(q) ||
          (p.nickname && p.nickname.toLowerCase().includes(q)) ||
          (p.classicTeamYear && p.classicTeamYear.toLowerCase().includes(q))
      );
    }

    const totalCollectedIcons = ALL_ICON_PLAYERS.filter((p) => collectedMap.has(p.id)).length;
    const legendsPct = Math.round((totalCollectedIcons / ALL_ICON_PLAYERS.length) * 100);

    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.legendsHeaderBanner, isDark && { backgroundColor: '#1E2738', borderColor: '#B45309' }]}>
          <View style={styles.legendsHeaderLeft}>
            <Ionicons name="sparkles" size={20} color={isDark ? '#FDE047' : '#713F12'} />
            <View>
              <Text style={[styles.legendsHeaderTitle, isDark && { color: '#FEF08A' }]}>GALERÍA DE GRANDES LEYENDAS</Text>
              <Text style={[styles.legendsHeaderSub, isDark && { color: '#FDE68A' }]}>
                {totalCollectedIcons} de {ALL_ICON_PLAYERS.length} Leyendas Inmortales ({legendsPct}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchRow, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
          <View style={[styles.searchBox, { backgroundColor: colors.bgCard, borderColor: colors.border, borderWidth: 1 }]}>
            <Ionicons name="search" size={16} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Buscar leyenda (ej. Jordan, Kobe, Shaq, Bird, Magic)..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Grid of All-Time Legend Cards */}
        <FlatList
          data={legendsList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.teamGrid}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => {
            const isUnlocked = collectedMap.has(item.id);

            if (isUnlocked) {
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    HapticsService.selectionTick();
                    setInspectedPlayer(item);
                  }}
                  style={styles.unlockedCardSlot}
                >
                  <View pointerEvents="none">
                    <NBACard player={item} size="md" />
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  HapticsService.selectionTick();
                  setInspectedPlayer(item);
                }}
                style={[
                  styles.lockedCardSlot,
                  styles.lockedLegendCardSlot,
                  isDark && { backgroundColor: '#141B29', borderColor: '#B45309' },
                ]}
              >
                <View style={[styles.lockedCardHeader, { backgroundColor: isDark ? '#1E2738' : '#FEF9C3' }]}>
                  <Text style={[styles.lockedOvrText, { color: isDark ? '#FBBF24' : '#B45309' }]}>{item.stats.ovr}</Text>
                  <Text style={[styles.lockedPosText, { color: isDark ? '#FDE68A' : '#78350F' }]}>{item.position}</Text>
                  <Text style={[styles.lockedUnitTag, { color: isDark ? '#FEF08A' : '#854D0E', backgroundColor: isDark ? '#451A03' : '#FEF08A' }]}>
                    {item.classicTeamYear || 'LEYENDA'}
                  </Text>
                </View>

                <View style={styles.lockedSilhouetteBox}>
                  <Ionicons name="trophy" size={48} color={isDark ? '#78350F' : '#FEF08A'} />
                  <Ionicons name="lock-closed" size={18} color={isDark ? '#F59E0B' : '#B45309'} style={styles.lockIconOverlay} />
                </View>

                <Text numberOfLines={1} style={[styles.lockedPlayerName, { color: isDark ? '#E2E8F0' : '#78350F' }]}>
                  {item.name}
                </Text>

                <View style={[styles.lockedFooter, { backgroundColor: isDark ? '#1E2738' : '#FEF9C3' }]}>
                  <Text style={[styles.lockedHelpText, { color: isDark ? '#FDE047' : '#854D0E' }]}>
                    {item.teamAbbr} · {item.stats.ovr} OVR
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  // Render "ALL" view (all collected cards ordered by OVR)
  const renderAllCollected = () => {
    const uniquePlayersMap = new Map<string, NBAPlayer>();
    cards.forEach((c) => {
      if (c.player && !uniquePlayersMap.has(c.player.id)) {
        uniquePlayersMap.set(c.player.id, c.player);
      }
    });

    let allCollected = Array.from(uniquePlayersMap.values());

    if (searchQuery.trim().length > 0) {
      allCollected = allCollected.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.teamAbbr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.classicTeamYear && p.classicTeamYear.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    allCollected.sort((a, b) => b.stats.ovr - a.stats.ovr);

    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.searchRow, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
          <View style={[styles.searchBox, { backgroundColor: colors.bgCard, borderColor: colors.border, borderWidth: 1 }]}>
            <Ionicons name="search" size={16} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Buscar por jugador o equipo..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={allCollected}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.unlockedCardSlot}
              onPress={() => {
                HapticsService.selectionTick();
                setInspectedPlayer(item);
              }}
            >
              <View pointerEvents="none">
                <NBACard player={item} size="md" />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="albums" size={36} color="#94A3B8" />
              <Text style={styles.emptyText}>No tienes cartas aún</Text>
              <Text style={styles.emptySub}>
                Abre sobres en la Tienda para coleccionar las estrellas y leyendas de la NBA.
              </Text>
            </View>
          }
        />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg },
        activeTeam && { backgroundColor: `${activeTeam.primaryColor}12` },
      ]}
    >
      {/* Top Album HUD */}
      <View style={[styles.topBar, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.topTitle, { color: colors.text }]}>{t.collection.title.toUpperCase()}</Text>
          <Text style={[styles.topSubtitle, { color: colors.textMuted }]}>
            {uniqueCount} {t.common.of} {totalMasterCount} {t.common.totalCards.toLowerCase()} ({progressPercent}%)
          </Text>
        </View>

        <View style={styles.topActionsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={async () => {
              await HapticsService.selectionTick();
              dispatch(setAchievementsModalVisible(true));
            }}
            style={[
              styles.trophyHeaderBtn,
              {
                backgroundColor: isDark ? colors.bgCardSecondary : '#FEF3C7',
                borderColor: isDark ? '#B45309' : '#FDE68A',
              },
            ]}
          >
            <Ionicons name="trophy-outline" size={16} color="#B45309" />
          </TouchableOpacity>

          {duplicateCount > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRecycleDuplicates}
              style={styles.recycleBtn}
            >
              <Ionicons name="refresh" size={12} color="#FFFFFF" />
              <Text style={styles.recycleBtnText}>
                {duplicateCount} (+{duplicateCoinsTotal.toLocaleString()})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
        />
      </View>

      {/* Category Selector (Este, Oeste, Equipos, Iconos, Todos) */}
      <View style={[styles.categoriesBar, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => handleCategoryChange('EAST')}
          style={[
            styles.catButton,
            { backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9' },
            currentCategory === 'EAST' && styles.catButtonActive,
          ]}
        >
          <Ionicons name="compass" size={13} color={currentCategory === 'EAST' ? '#FFFFFF' : colors.textMuted} />
          <Text
            style={[
              styles.catButtonText,
              { color: colors.textMuted },
              currentCategory === 'EAST' && styles.catButtonTextActive,
            ]}
          >
            {t.collection.eastConf}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCategoryChange('WEST')}
          style={[
            styles.catButton,
            { backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9' },
            currentCategory === 'WEST' && styles.catButtonActive,
          ]}
        >
          <Ionicons name="compass" size={13} color={currentCategory === 'WEST' ? '#FFFFFF' : colors.textMuted} />
          <Text
            style={[
              styles.catButtonText,
              { color: colors.textMuted },
              currentCategory === 'WEST' && styles.catButtonTextActive,
            ]}
          >
            {t.collection.westConf}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCategoryChange('TEAMS')}
          style={[
            styles.catButton,
            { backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9' },
            currentCategory === 'TEAMS' && styles.catButtonActive,
          ]}
        >
          <Ionicons name="trophy" size={13} color={currentCategory === 'TEAMS' ? '#FFFFFF' : colors.textMuted} />
          <Text
            style={[
              styles.catButtonText,
              { color: colors.textMuted },
              currentCategory === 'TEAMS' && styles.catButtonTextActive,
            ]}
          >
            {t.collection.teams}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCategoryChange('LEGENDS')}
          style={[
            styles.catButton,
            { backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9' },
            currentCategory === 'LEGENDS' && styles.catButtonActiveLegends,
          ]}
        >
          <Ionicons name="sparkles" size={13} color={currentCategory === 'LEGENDS' ? '#713F12' : '#B45309'} />
          <Text
            style={[
              styles.catButtonText,
              { color: colors.textMuted },
              currentCategory === 'LEGENDS' && styles.catButtonTextActiveLegends,
            ]}
          >
            Leyendas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCategoryChange('ALL')}
          style={[
            styles.catButton,
            { backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9' },
            currentCategory === 'ALL' && styles.catButtonActive,
          ]}
        >
          <Ionicons name="people" size={13} color={currentCategory === 'ALL' ? '#FFFFFF' : colors.textMuted} />
          <Text
            style={[
              styles.catButtonText,
              { color: colors.textMuted },
              currentCategory === 'ALL' && styles.catButtonTextActive,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content View */}
      {selectedTeamAbbr ? (
        renderTeamAlbum(selectedTeamAbbr)
      ) : currentCategory === 'LEGENDS' ? (
        renderLegendsAlbum()
      ) : currentCategory === 'ALL' ? (
        renderAllCollected()
      ) : (
        /* Grid of Franchise Badges for East / West / Teams */
        <FlatList
          data={getTeamsList()}
          keyExtractor={(item) => item.abbreviation}
          numColumns={2}
          contentContainerStyle={styles.franchiseList}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => {
            const teamPlayers = ACTIVE_NBA_PLAYERS.filter((p) => p.teamAbbr === item.abbreviation);
            const collectedForTeam = teamPlayers.filter((p) => collectedMap.has(p.id));
            const pct = Math.round((collectedForTeam.length / teamPlayers.length) * 100);

            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSelectTeam(item.abbreviation)}
                style={[
                  styles.teamCard,
                  {
                    backgroundColor: colors.bgCard,
                    borderColor: item.primaryColor ? `${item.primaryColor}55` : colors.border,
                  },
                ]}
              >
                <Image
                  source={{ uri: item.logoUrl }}
                  style={styles.teamLogo}
                  resizeMode="contain"
                />
                <Text numberOfLines={1} style={[styles.teamName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.teamCity, { color: colors.textMuted }]}>{item.city}</Text>

                <View style={[styles.teamProgressMiniWrap, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                  <View
                    style={[
                      styles.teamProgressMiniFill,
                      { width: `${pct}%`, backgroundColor: item.primaryColor || '#0284C7' },
                    ]}
                  />
                </View>
                <Text style={[styles.teamCount, { color: colors.textMuted }]}>
                  {collectedForTeam.length} / {teamPlayers.length} Cartas ({pct}%)
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Player Inspect Detail Modal */}
      {inspectedPlayer && (
        <PlayerDetailModal
          visible={true}
          player={inspectedPlayer}
          onClose={() => setInspectedPlayer(null)}
          onDelete={
            onDeleteCard
              ? () => {
                  onDeleteCard(inspectedPlayer.id);
                  setInspectedPlayer(null);
                }
              : undefined
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  topSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trophyHeaderBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recycleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  recycleBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284C7',
  },
  categoriesBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 4,
  },
  catButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    gap: 3,
  },
  catButtonActive: {
    backgroundColor: '#1D428A',
  },
  catButtonActiveLegends: {
    backgroundColor: '#FEF08A',
    borderColor: '#CA8A04',
    borderWidth: 1,
  },
  catButtonText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#64748B',
  },
  catButtonTextActive: {
    color: '#FFFFFF',
  },
  catButtonTextActiveLegends: {
    color: '#713F12',
    fontWeight: '900',
  },
  franchiseList: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  teamCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  teamLogo: {
    width: 44,
    height: 44,
    marginBottom: 6,
  },
  teamName: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  teamCity: {
    fontSize: 9.5,
    color: '#64748B',
    marginBottom: 6,
  },
  teamProgressMiniWrap: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  teamProgressMiniFill: {
    height: '100%',
  },
  teamCount: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  teamAlbumContainer: {
    flex: 1,
  },
  teamAlbumBanner: {
    padding: 12,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  teamBannerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerTeamLogo: {
    width: 44,
    height: 44,
  },
  bannerTeamName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bannerTeamStats: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  teamGrid: {
    padding: 12,
  },
  unlockedCardSlot: {
    width: '48.5%',
    alignItems: 'stretch',
  },
  lockedCardSlot: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 224,
  },
  lockedLegendCardSlot: {
    borderColor: '#CA8A04',
    backgroundColor: '#FEFCE8',
  },
  lockedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
  },
  lockedOvrText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#64748B',
  },
  lockedPosText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
  },
  lockedUnitTag: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#475569',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  lockedSilhouetteBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  lockIconOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  lockedPlayerName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 6,
  },
  lockedFooter: {
    width: '100%',
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: 'center',
  },
  lockedHelpText: {
    fontSize: 8.5,
    fontWeight: 'bold',
  },
  legendsHeaderBanner: {
    backgroundColor: '#FEF08A',
    padding: 12,
    borderBottomWidth: 1.5,
    borderColor: '#CA8A04',
  },
  legendsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendsHeaderTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#713F12',
    letterSpacing: 0.5,
  },
  legendsHeaderSub: {
    fontSize: 10,
    color: '#854D0E',
    fontWeight: '600',
  },
  searchRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 11.5,
    color: '#0F172A',
    padding: 0,
  },
  listContent: {
    padding: 12,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  classicTeamsList: {
    padding: 12,
    gap: 12,
  },
  classicTeamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FEF08A',
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  classicTeamCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  classicTeamLogo: {
    width: 46,
    height: 46,
  },
  classicTeamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  classicTeamName: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
  },
  classicTeamOvrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF08A',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CA8A04',
  },
  classicTeamOvrText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#78350F',
  },
  classicTeamFranchise: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  classicTeamDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 8,
    lineHeight: 15,
  },
  classicTeamDescHeader: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 3,
    lineHeight: 13,
  },
  startersPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  starterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  starterPillUnlocked: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  starterPillPos: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#64748B',
  },
  starterPillPosUnlocked: {
    color: '#166534',
  },
  starterPillName: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#334155',
  },
  starterPillNameUnlocked: {
    color: '#14532D',
    fontWeight: '800',
  },
  classicTeamCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  classicTeamProgressWrap: {
    flex: 1,
    marginRight: 12,
  },
  classicTeamProgressBarBg: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  classicTeamProgressBarFill: {
    height: '100%',
    backgroundColor: '#EAB308',
    borderRadius: 3,
  },
  classicTeamProgressText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#854D0E',
    marginTop: 3,
  },
  viewQuintetoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  viewQuintetoBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#78350F',
  },
});
