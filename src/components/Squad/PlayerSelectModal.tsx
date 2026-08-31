import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Position, UserCard } from '../../types';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { NBACard } from '../Card/NBACard';
import { THEME } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface PlayerSelectModalProps {
  visible: boolean;
  position: Position | null;
  currentCard: UserCard | null;
  availableCards: UserCard[];
  occupiedPlayerIds?: Set<string>;
  onSelect: (card: UserCard) => void;
  onClose: () => void;
}

const POSITION_NAMES: Record<Position, string> = {
  PG: 'Bases (PG)',
  SG: 'Escoltas (SG)',
  SF: 'Aleros (SF)',
  PF: 'Ala-Pívots (PF)',
  C: 'Pívots (C)',
};

export const PlayerSelectModal: React.FC<PlayerSelectModalProps> = ({
  visible,
  position,
  currentCard,
  availableCards,
  occupiedPlayerIds = new Set(),
  onSelect,
  onClose,
}) => {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reset filter when modal opens
  React.useEffect(() => {
    if (visible) {
      setSelectedTeamFilter('ALL');
      setSearchQuery('');
    }
  }, [visible]);

  if (!visible || !position) return null;

  // Deduplicate available cards by unique player ID so multiple copies of the same player don't crowd the list
  const seenPlayerIds = new Set<string>();
  const uniqueAvailable = availableCards.filter((card) => {
    const key = card.player?.id || card.playerId;
    if (seenPlayerIds.has(key)) return false;
    seenPlayerIds.add(key);
    return true;
  });

  // STRICT POSITIONAL & NON-DUPLICATE FILTER:
  // 1. Player must be eligible for this position
  // 2. Player cannot already be in another position on the team
  const eligibleCards = uniqueAvailable.filter((c) => {
    const isPosMatch =
      c.player.position === position ||
      c.player.secondaryPosition === position;

    const isAlreadyInOtherPosition =
      occupiedPlayerIds.has(c.playerId) ||
      occupiedPlayerIds.has(c.player.id);

    return isPosMatch && !isAlreadyInOtherPosition;
  });

  // Calculate teams present in eligible cards for quick filters
  const teamCounts: Record<string, number> = {};
  eligibleCards.forEach((c) => {
    teamCounts[c.player.teamAbbr] = (teamCounts[c.player.teamAbbr] || 0) + 1;
  });
  const availableTeams = Object.keys(teamCounts).sort();

  // Apply Team Filter & Search Query
  const filteredCards = eligibleCards.filter((c) => {
    const matchTeam =
      selectedTeamFilter === 'ALL' || c.player.teamAbbr === selectedTeamFilter;

    const matchSearch =
      searchQuery.trim() === '' ||
      c.player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.player.teamAbbr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchTeam && matchSearch;
  });

  // Sort descending by OVR rating
  filteredCards.sort((a, b) => b.player.stats.ovr - a.player.stats.ovr);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                SELECCIONAR {POSITION_NAMES[position].toUpperCase()}
              </Text>
              <Text style={styles.modalSubtitle}>
                Jugadores aptos para <Text style={styles.posHighlight}>{position}</Text> ({filteredCards.length} disponibles)
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Search Input Bar (Always stays fixed at top) */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por jugador o franquicia..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Horizontal NBA Team Filter Bar (Fixed at top) */}
          {availableTeams.length > 0 && (
            <View style={styles.teamFilterWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.teamFilterScroll}
                keyboardShouldPersistTaps="handled"
              >
                {/* 'ALL' pill */}
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setSelectedTeamFilter('ALL');
                  }}
                  style={[
                    styles.teamPill,
                    selectedTeamFilter === 'ALL' && styles.teamPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.teamPillText,
                      selectedTeamFilter === 'ALL' && styles.teamPillTextActive,
                    ]}
                  >
                    Todos ({eligibleCards.length})
                  </Text>
                </TouchableOpacity>

                {/* Individual Team pills */}
                {availableTeams.map((abbr) => {
                  const teamInfo = NBA_TEAMS[abbr];
                  const isSelected = selectedTeamFilter === abbr;
                  return (
                    <TouchableOpacity
                      key={abbr}
                      onPress={() => {
                        Keyboard.dismiss();
                        setSelectedTeamFilter(abbr);
                      }}
                      style={[
                        styles.teamPill,
                        isSelected && styles.teamPillActive,
                      ]}
                    >
                      {teamInfo?.logoUrl && (
                        <Image
                          source={{ uri: teamInfo.logoUrl }}
                          style={styles.teamPillLogo}
                          resizeMode="contain"
                        />
                      )}
                      <Text
                        style={[
                          styles.teamPillText,
                          isSelected && styles.teamPillTextActive,
                        ]}
                      >
                        {abbr} ({teamCounts[abbr]})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Cards Grid - Occupies remaining fixed space and scrolls smoothly */}
          <FlatList
            data={filteredCards}
            keyExtractor={(item, index) => `${item.playerId}-${index}`}
            numColumns={2}
            style={styles.flatList}
            contentContainerStyle={[
              styles.listContent,
              filteredCards.length === 0 && styles.listContentEmpty,
            ]}
            columnWrapperStyle={filteredCards.length > 0 ? styles.columnWrapper : undefined}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderItem={({ item }) => {
              const isSelected =
                currentCard?.playerId === item.playerId ||
                currentCard?.player?.id === item.player.id;
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    Keyboard.dismiss();
                    onSelect(item);
                  }}
                  style={[
                    styles.cardWrapper,
                    isSelected && styles.cardWrapperSelected,
                  ]}
                >
                  <View pointerEvents="none">
                    <NBACard player={item.player} size="md" />
                  </View>

                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      <Text style={styles.selectedBadgeText}>TITULAR ACTUAL</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={36} color="#94A3B8" />
                <Text style={styles.emptyText}>
                  No se encontraron jugadores para este filtro
                </Text>
                <Text style={styles.emptySubtext}>
                  {selectedTeamFilter !== 'ALL'
                    ? `No tienes jugadores del equipo ${selectedTeamFilter} aptos para ${position}.`
                    : `No tienes más jugadores disponibles para la posición ${position}.`}
                </Text>
                {selectedTeamFilter !== 'ALL' && (
                  <TouchableOpacity
                    onPress={() => setSelectedTeamFilter('ALL')}
                    style={styles.resetFilterBtn}
                  >
                    <Text style={styles.resetFilterBtnText}>Ver Todos los Equipos</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: '86%', // Fixed stable space so it never drops down or shrinks
    borderWidth: 1,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  posHighlight: {
    color: '#006BB6',
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },

  // Search Bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },

  // Team Filter Bar
  teamFilterWrapper: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  teamFilterScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  teamPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  teamPillActive: {
    backgroundColor: '#006BB6',
    borderColor: '#006BB6',
  },
  teamPillLogo: {
    width: 15,
    height: 15,
  },
  teamPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  teamPillTextActive: {
    color: '#FFFFFF',
  },

  flatList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 30,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  cardWrapper: {
    position: 'relative',
  },
  cardWrapperSelected: {
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 12,
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
    zIndex: 10,
  },
  selectedBadgeText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  resetFilterBtn: {
    marginTop: 10,
    backgroundColor: '#006BB6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
