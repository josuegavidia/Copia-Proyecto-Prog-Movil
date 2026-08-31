import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { UserCard, Conference, NBAPlayer } from '../types';
import { NBA_PLAYERS_DATA } from '../data/nbaPlayers';
import { NBA_TEAMS } from '../data/nbaTeams';
import { NBACard } from '../components/Card/NBACard';
import { PlayerDetailModal } from '../components/Card/PlayerDetailModal';
import { HapticsService } from '../services/haptics';
import { Ionicons } from '@expo/vector-icons';
import { Ionicon } from '../components/Common/Ionicon';

interface CollectionScreenProps {
  cards: UserCard[];
  onRecycleDuplicates: (recycledCoins: number) => void;
  onDeleteCard?: (playerId: string) => void;
}

type ViewCategory = 'EAST' | 'WEST' | 'TEAMS' | 'ALL';

export const CollectionScreen: React.FC<CollectionScreenProps> = ({
  cards,
  onRecycleDuplicates,
  onDeleteCard,
}) => {
  const [currentCategory, setCurrentCategory] = useState<ViewCategory>('EAST');
  const [selectedTeamAbbr, setSelectedTeamAbbr] = useState<string | null>(null);
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

  const totalMasterCount = NBA_PLAYERS_DATA.length; // 300 players
  const uniqueCount = collectedMap.size;
  const progressPercent = Math.round((uniqueCount / totalMasterCount) * 100);

  // Duplicate calculation
  const idCounts: Record<string, number> = {};
  cards.forEach((c) => {
    idCounts[c.playerId] = (idCounts[c.playerId] || 0) + 1;
  });
  const duplicateCount = Object.values(idCounts).reduce(
    (acc, count) => acc + (count > 1 ? count - 1 : 0),
    0
  );

  const handleRecycleDuplicates = async () => {
    if (duplicateCount === 0) {
      Alert.alert('Sin Duplicados', 'No tienes cartas duplicadas en tu inventario.');
      return;
    }

    await HapticsService.selectionTick();
    const coinsEarned = duplicateCount * 150;

    Alert.alert(
      'Reciclar Duplicados',
      `¿Deseas reciclar ${duplicateCount} carta(s) repetida(s) a cambio de +${coinsEarned} monedas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: `Reciclar (+${coinsEarned})`,
          onPress: async () => {
            await HapticsService.celebrate();
            onRecycleDuplicates(coinsEarned);
          },
        },
      ]
    );
  };

  const handleCategoryChange = async (cat: ViewCategory) => {
    await HapticsService.selectionTick();
    setCurrentCategory(cat);
    setSelectedTeamAbbr(null);
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

  // Render Team Album View (Background transforms to franchise color!)
  const renderTeamAlbum = (teamAbbr: string) => {
    const team = NBA_TEAMS[teamAbbr];
    const teamPlayers = NBA_PLAYERS_DATA.filter((p) => p.teamAbbr === teamAbbr);
    const collectedForTeam = teamPlayers.filter((p) => collectedMap.has(p.id));

    return (
      <View
        style={[
          styles.teamAlbumContainer,
          { backgroundColor: team.primaryColor ? `${team.primaryColor}18` : '#F8FAFC' },
        ]}
      >
        {/* Franchise Header Banner */}
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

        {/* 10 Player Slots Grid */}
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
                  <NBACard player={item} size="md" />
                </TouchableOpacity>
              );
            }

            // Locked Slot
            return (
              <View
                style={[
                  styles.lockedSlot,
                  { borderColor: team.primaryColor || '#CBD5E1' },
                ]}
              >
                <View style={styles.lockedHeader}>
                  <Text style={styles.lockedNum}>#{item.number}</Text>
                  <Text style={styles.lockedPos}>{item.position}</Text>
                </View>

                <View style={styles.lockedBody}>
                  <Ionicons name="lock-closed" size={28} color="#94A3B8" />
                  <Text numberOfLines={1} style={styles.lockedNameHint}>
                    {item.name}
                  </Text>
                  <Text style={styles.lockedOvrHint}>{item.stats.ovr} OVR</Text>
                </View>

                <View
                  style={[
                    styles.lockedFooter,
                    { backgroundColor: team.primaryColor ? `${team.primaryColor}22` : '#F1F5F9' },
                  ]}
                >
                  <Text style={[styles.lockedHelpText, { color: team.primaryColor || '#0F172A' }]}>
                    Bloqueado en Sobres
                  </Text>
                </View>
              </View>
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
          p.teamAbbr.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    allCollected.sort((a, b) => b.stats.ovr - a.stats.ovr);

    return (
      <View style={{ flex: 1 }}>
        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por jugador o equipo..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={16} color="#64748B" />
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
              onPress={() => {
                HapticsService.selectionTick();
                setInspectedPlayer(item);
              }}
            >
              <NBACard player={item} size="md" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="albums" size={36} color="#94A3B8" />
              <Text style={styles.emptyText}>No tienes cartas aún</Text>
              <Text style={styles.emptySub}>
                Abre sobres en la Tienda para coleccionar las 300 estrellas de la NBA.
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
        activeTeam && { backgroundColor: `${activeTeam.primaryColor}12` },
      ]}
    >
      {/* Top Album HUD */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topTitle}>COLECCIÓN NBA</Text>
          <Text style={styles.topSubtitle}>
            {uniqueCount} de {totalMasterCount} cartas ({progressPercent}%) · 30 Equipos
          </Text>
        </View>

        <View style={styles.topActionsRow}>
          {duplicateCount > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleRecycleDuplicates}
              style={styles.recycleBtn}
            >
              <Ionicons name="refresh" size={12} color="#FFFFFF" />
              <Text style={styles.recycleBtnText}>
                Reciclar {duplicateCount} (+{duplicateCount * 150})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
        />
      </View>

      {/* Category Selector (Este, Oeste, Equipos, Todos) */}
      <View style={styles.categoriesBar}>
        <TouchableOpacity
          onPress={() => handleCategoryChange('EAST')}
          style={[
            styles.catButton,
            currentCategory === 'EAST' && styles.catButtonActive,
          ]}
        >
          <Ionicons name="compass" size={14} color={currentCategory === 'EAST' ? '#FFFFFF' : '#64748B'} />
          <Text
            style={[
              styles.catButtonText,
              currentCategory === 'EAST' && styles.catButtonTextActive,
            ]}
          >
            División Este
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCategoryChange('WEST')}
          style={[
            styles.catButton,
            currentCategory === 'WEST' && styles.catButtonActive,
          ]}
        >
          <Ionicons name="compass" size={14} color={currentCategory === 'WEST' ? '#FFFFFF' : '#64748B'} />
          <Text
            style={[
              styles.catButtonText,
              currentCategory === 'WEST' && styles.catButtonTextActive,
            ]}
          >
            División Oeste
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCategoryChange('TEAMS')}
          style={[
            styles.catButton,
            currentCategory === 'TEAMS' && styles.catButtonActive,
          ]}
        >
          <Ionicons name="trophy" size={14} color={currentCategory === 'TEAMS' ? '#FFFFFF' : '#64748B'} />
          <Text
            style={[
              styles.catButtonText,
              currentCategory === 'TEAMS' && styles.catButtonTextActive,
            ]}
          >
            Equipos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCategoryChange('ALL')}
          style={[
            styles.catButton,
            currentCategory === 'ALL' && styles.catButtonActive,
          ]}
        >
          <Ionicons name="people" size={14} color={currentCategory === 'ALL' ? '#FFFFFF' : '#64748B'} />
          <Text
            style={[
              styles.catButtonText,
              currentCategory === 'ALL' && styles.catButtonTextActive,
            ]}
          >
            Todos ({uniqueCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* VIEW CONTENT */}
      {selectedTeamAbbr ? (
        renderTeamAlbum(selectedTeamAbbr)
      ) : currentCategory === 'ALL' ? (
        renderAllCollected()
      ) : (
        /* List of Teams for East / West / Teams */
        <FlatList
          data={getTeamsList()}
          keyExtractor={(item) => item.abbreviation}
          contentContainerStyle={styles.teamsListContent}
          renderItem={({ item }) => {
            const teamPlayers = NBA_PLAYERS_DATA.filter(
              (p) => p.teamAbbr === item.abbreviation
            );
            const collectedCount = teamPlayers.filter((p) =>
              collectedMap.has(p.id)
            ).length;
            const teamPercent = Math.round(
              (collectedCount / teamPlayers.length) * 100
            );

            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSelectTeam(item.abbreviation)}
                style={styles.teamCard}
              >
                <Image
                  source={{ uri: item.logoUrl }}
                  style={styles.teamListLogo}
                  resizeMode="contain"
                />

                <View style={styles.teamCardInfo}>
                  <Text style={styles.teamCardName}>{item.name}</Text>
                  <Text style={styles.teamCardConf}>
                    {item.conference} · {item.abbreviation}
                  </Text>

                  {/* Team Progress Mini Bar */}
                  <View style={styles.teamMiniBarBg}>
                    <View
                      style={[
                        styles.teamMiniBarFill,
                        {
                          width: `${teamPercent}%`,
                          backgroundColor: item.primaryColor || '#0284C7',
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.teamProgressBadge}>
                  <Text style={styles.teamProgressText}>
                    {collectedCount}/10
                  </Text>
                  <Text style={styles.teamProgressPct}>{teamPercent}%</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Inspect Card Modal with full attributes */}
      <PlayerDetailModal
        visible={inspectedPlayer !== null}
        player={inspectedPlayer}
        onClose={() => setInspectedPlayer(null)}
        onDelete={
          onDeleteCard && inspectedPlayer
            ? () => onDeleteCard(inspectedPlayer.id)
            : undefined
        }
      />
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  topSubtitle: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: 'bold',
    marginTop: 2,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recycleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  recycleBtnText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#0284C7',
  },

  // Categories Bar
  categoriesBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 6,
  },
  catButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  catButtonActive: {
    backgroundColor: '#0284C7',
  },
  catButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  catButtonTextActive: {
    color: '#FFFFFF',
  },

  // Team Cards List
  teamsListContent: {
    padding: 12,
    gap: 8,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  teamListLogo: {
    width: 44,
    height: 44,
  },
  teamCardInfo: {
    flex: 1,
  },
  teamCardName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  teamCardConf: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 4,
  },
  teamMiniBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  teamMiniBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  teamProgressBadge: {
    alignItems: 'flex-end',
  },
  teamProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  teamProgressPct: {
    fontSize: 10,
    color: '#0284C7',
    fontWeight: '600',
  },

  // Team Album View
  teamAlbumContainer: {
    flex: 1,
  },
  teamAlbumBanner: {
    padding: 12,
    paddingTop: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  teamBannerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerTeamLogo: {
    width: 48,
    height: 48,
  },
  bannerTeamName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bannerTeamStats: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  teamGrid: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  unlockedCardSlot: {
    position: 'relative',
  },
  lockedSlot: {
    width: 155,
    height: 230,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  lockedNum: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  lockedPos: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  lockedBody: {
    alignItems: 'center',
    gap: 6,
  },
  lockedNameHint: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
  },
  lockedOvrHint: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  lockedFooter: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  lockedHelpText: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Search & All Grid
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  searchInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 40,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  // Inspect Overlay
  inspectOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inspectBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inspectTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  inspectHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeInspectBtn: {
    padding: 4,
  },
  flipHelp: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
  },
});
