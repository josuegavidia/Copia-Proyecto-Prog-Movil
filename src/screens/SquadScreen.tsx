import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SquadLineup, UserCard, Position } from '../types';
import { calculateSquadSynergy } from '../services/chemistry';
import { StorageService } from '../services/storage';
import { NBA_TEAMS } from '../data/nbaTeams';
import { BasketballCourt } from '../components/Squad/BasketballCourt';
import { PlayerSelectModal } from '../components/Squad/PlayerSelectModal';
import { PlayerDetailModal } from '../components/Card/PlayerDetailModal';
import { SquadExportModal } from '../components/Squad/SquadExportModal';
import { HapticsService } from '../services/haptics';
import { THEME } from '../theme/colors';
import { Ionicon } from '../components/Common/Ionicon';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateLineup, earnCoins } from '../store/slices/squadSlice';

interface SquadScreenProps {
  lineup?: SquadLineup;
  inventory?: UserCard[];
  onUpdateLineup?: (newLineup: SquadLineup) => void;
  onNavigateToCoachCreator?: () => void;
  onCoinsEarned?: (coins: number) => void;
}

const PLAYER_SLOT_KEYS: ('pg' | 'sg' | 'sf' | 'pf' | 'c')[] = ['pg', 'sg', 'sf', 'pf', 'c'];
const NBA_TEAMS_LIST = Object.values(NBA_TEAMS);

export const SquadScreen: React.FC<SquadScreenProps> = ({
  lineup: propsLineup,
  inventory: propsInventory,
  onUpdateLineup,
  onNavigateToCoachCreator,
  onCoinsEarned,
}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const reduxLineup = useAppSelector((state) => state.squad.lineup);
  const reduxCards = useAppSelector((state) => state.squad.cards);

  const lineup = propsLineup || reduxLineup;
  const inventory = propsInventory || reduxCards;

  const handleUpdateSquadLineup = (newLineup: SquadLineup) => {
    if (onUpdateLineup) {
      onUpdateLineup(newLineup);
    } else {
      dispatch(updateLineup(newLineup));
    }
  };

  const handleCoinsEarned = (coins: number) => {
    if (onCoinsEarned) {
      onCoinsEarned(coins);
    } else {
      dispatch(earnCoins(coins));
    }
  };

  const [teamName, setTeamNameState] = useState<string>('Mi Franquicia');
  const [teamLogo, setTeamLogoState] = useState<string>('https://a.espncdn.com/i/teamlogos/nba/500/lal.png');
  const [teamAbbr, setTeamAbbrState] = useState<string>('LAL');

  const [nameEditModalVisible, setNameEditModalVisible] = useState(false);
  const [tempTeamName, setTempTeamName] = useState<string>('Mi Franquicia');
  const [tempTeamLogo, setTempTeamLogo] = useState<string>('https://a.espncdn.com/i/teamlogos/nba/500/lal.png');
  const [tempTeamAbbr, setTempTeamAbbr] = useState<string>('LAL');

  const [selectedSlotPos, setSelectedSlotPos] = useState<Position | null>(null);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [inspectedCard, setInspectedCard] = useState<{ card: UserCard; position: Position } | null>(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const synergy = calculateSquadSynergy(lineup);

  useEffect(() => {
    const loadTeamCustomization = async () => {
      const savedName = await StorageService.getTeamName();
      const savedLogo = await StorageService.getTeamLogo();
      const savedAbbr = await StorageService.getTeamAbbr();
      setTeamNameState(savedName);
      setTeamLogoState(savedLogo);
      setTeamAbbrState(savedAbbr);
    };
    loadTeamCustomization();
  }, []);

  const handleSaveTeamCustomization = async () => {
    const trimmed = tempTeamName.trim();
    if (!trimmed) {
      Alert.alert('Nombre Requerido', 'Por favor ingresa un nombre para tu equipo.');
      return;
    }
    await HapticsService.celebrate();
    const updatedName = await StorageService.setTeamName(trimmed);
    const updatedLogo = await StorageService.setTeamLogo(tempTeamLogo);
    const updatedAbbr = await StorageService.setTeamAbbr(tempTeamAbbr);

    setTeamNameState(updatedName);
    setTeamLogoState(updatedLogo);
    setTeamAbbrState(updatedAbbr);

    const updatedLineup: SquadLineup = {
      ...lineup,
      teamName: updatedName,
      teamLogo: updatedLogo,
      teamAbbr: updatedAbbr,
    };
    handleUpdateSquadLineup(updatedLineup);
    setNameEditModalVisible(false);
  };

  const handleSlotPress = async (pos: Position) => {
    await HapticsService.selectionTick();
    setSelectedSlotPos(pos);
    setSelectModalVisible(true);
  };

  const handlePlayerPress = async (card: UserCard, pos: Position) => {
    await HapticsService.selectionTick();
    setInspectedCard({ card, position: pos });
  };

  const handleSelectPlayer = async (card: UserCard) => {
    if (!selectedSlotPos) return;
    await HapticsService.celebrate();

    const key = selectedSlotPos.toLowerCase() as 'pg' | 'sg' | 'sf' | 'pf' | 'c';
    const updatedLineup: SquadLineup = {
      ...lineup,
      [key]: card,
    };

    handleUpdateSquadLineup(updatedLineup);
    setSelectModalVisible(false);
  };

  const getCurrentCardForSlot = (pos: Position | null): UserCard | null => {
    if (!pos) return null;
    return lineup[pos.toLowerCase() as 'pg' | 'sg' | 'sf' | 'pf' | 'c'];
  };

  // Compute player IDs already active in OTHER starting positions to prevent duplicates
  const getOtherOccupiedPlayerIds = (targetPos: Position | null): Set<string> => {
    if (!targetPos) return new Set();
    const occupied = new Set<string>();
    const currentKey = targetPos.toLowerCase() as 'pg' | 'sg' | 'sf' | 'pf' | 'c';

    PLAYER_SLOT_KEYS.forEach((s) => {
      if (s !== currentKey) {
        const slotCard = lineup[s];
        if (slotCard) {
          occupied.add(slotCard.playerId);
          occupied.add(slotCard.player.id);
        }
      }
    });
    return occupied;
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={async () => {
            await HapticsService.selectionTick();
            setTempTeamName(teamName);
            setTempTeamLogo(teamLogo);
            setTempTeamAbbr(teamAbbr);
            setNameEditModalVisible(true);
          }}
          style={styles.teamNameHeaderWrap}
        >
          {/* Official Franchise Logo */}
          <View style={styles.headerLogoContainer}>
            <Image
              source={{ uri: teamLogo }}
              style={styles.headerTeamLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.teamHeaderInfo}>
            <View style={styles.titleWithIcon}>
              <Text numberOfLines={1} style={styles.headerTitle}>
                {teamName.toUpperCase()}
              </Text>
              <View style={styles.editPencilBadge}>
                <Ionicons name="pencil" size={11} color="#006BB6" />
              </View>
            </View>
            <Text style={styles.headerSubtitle}>
              Toca para editar escudo y nombre · {inventory.length} {inventory.length === 1 ? 'jugador' : 'jugadores'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={async () => {
            await HapticsService.selectionTick();
            setExportModalVisible(true);
          }}
          style={styles.exportHeaderBtn}
        >
          <Ionicons name="share-social-outline" size={15} color="#006BB6" style={{ marginRight: 4 }} />
          <Text style={styles.exportHeaderBtnText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hudContainer}>
        <View style={styles.ovrBigBox}>
          <Text style={styles.ovrLabel}>OVR TOTAL</Text>
          <Text style={styles.ovrScore}>{synergy.totalOvr}</Text>
        </View>

        <View style={styles.hudStatsGrid}>
          <View style={styles.hudStatBox}>
            <View style={styles.statLabelRow}>
              <Ionicons name="flame" size={12} color="#D97706" style={{ marginRight: 3 }} />
              <Text style={styles.statLabelText}>QUÍMICA</Text>
            </View>
            <Text style={[styles.statValue, { color: '#D97706' }]}>
              {synergy.teamChemistry}%
            </Text>
          </View>

          <View style={styles.hudStatBox}>
            <View style={styles.statLabelRow}>
              <Ionicons name="flash" size={12} color="#0284C7" style={{ marginRight: 3 }} />
              <Text style={styles.statLabelText}>ATAQUE</Text>
            </View>
            <Text style={[styles.statValue, { color: '#0284C7' }]}>
              {synergy.offenseRating}
            </Text>
          </View>

          <View style={styles.hudStatBox}>
            <View style={styles.statLabelRow}>
              <Ionicons name="shield" size={12} color="#16A34A" style={{ marginRight: 3 }} />
              <Text style={styles.statLabelText}>DEFENSA</Text>
            </View>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>
              {synergy.defenseRating}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BasketballCourt
          lineup={lineup}
          onSlotPress={handleSlotPress}
          onPlayerPress={handlePlayerPress}
          onCoachPress={onNavigateToCoachCreator || (() => navigation.navigate('Coach'))}
        />

        {synergy.structuredBonuses && synergy.structuredBonuses.length > 0 && (
          <View style={styles.synergyCard}>
            <Text style={styles.synergyHeaderTitle}>EFECTOS DE QUÍMICA Y TÁCTICA</Text>
            <View style={styles.bonusesList}>
              {synergy.structuredBonuses.map((bonus, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.bonusBadge,
                    bonus.type === 'warning'
                      ? styles.bonusBadgeWarning
                      : bonus.type === 'coach'
                        ? styles.bonusBadgeCoach
                        : styles.bonusBadgePositive,
                  ]}
                >
                  <Ionicon
                    name={bonus.iconName as any}
                    size={14}
                    color={
                      bonus.type === 'warning'
                        ? '#DC2626'
                        : bonus.type === 'coach'
                          ? '#006BB6'
                          : '#D97706'
                    }
                  />
                  <Text
                    style={[
                      styles.bonusBadgeText,
                      bonus.type === 'warning'
                        ? { color: '#B91C1C' }
                        : bonus.type === 'coach'
                          ? { color: '#0369A1' }
                          : { color: '#92400E' },
                    ]}
                  >
                    {bonus.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {inspectedCard && (
        <PlayerDetailModal
          visible={true}
          player={inspectedCard.card.player}
          actionLabel="Sustituir Jugador"
          onAction={() => {
            const pos = inspectedCard.position;
            setInspectedCard(null);
            handleSlotPress(pos);
          }}
          onClose={() => setInspectedCard(null)}
        />
      )}

      <PlayerSelectModal
        visible={selectModalVisible}
        position={selectedSlotPos}
        currentCard={getCurrentCardForSlot(selectedSlotPos)}
        availableCards={inventory}
        occupiedPlayerIds={getOtherOccupiedPlayerIds(selectedSlotPos)}
        onSelect={handleSelectPlayer}
        onClose={() => setSelectModalVisible(false)}
      />

      <SquadExportModal
        visible={exportModalVisible}
        lineup={lineup}
        synergy={synergy}
        teamName={teamName}
        onClose={() => setExportModalVisible(false)}
      />

      <Modal visible={nameEditModalVisible} transparent animationType="fade">
        <View style={styles.nameEditOverlay}>
          <View style={styles.nameEditCard}>
            <View style={styles.nameEditHeader}>
              <View style={styles.nameEditTitleWrap}>
                <Ionicons name="pencil" size={16} color="#006BB6" style={{ marginRight: 6 }} />
                <Text style={styles.nameEditTitle}>PERSONALIZAR FRANQUICIA</Text>
              </View>
              <TouchableOpacity
                onPress={() => setNameEditModalVisible(false)}
                style={styles.closeNameModalBtn}
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.nameEditSubtitle}>
              Personaliza el nombre y logotipo de tu equipo. Aparecerá en tu quinteto, partidos y tabla de la liga.
            </Text>

            <Text style={styles.modalInputLabel}>NOMBRE DE TU EQUIPO:</Text>
            <TextInput
              style={styles.nameInput}
              value={tempTeamName}
              onChangeText={setTempTeamName}
              placeholder="Ej. Los Ángeles Vibe / Dream Team"
              placeholderTextColor="#94A3B8"
              maxLength={26}
              autoCapitalize="words"
            />

            <Text style={styles.modalInputLabel}>LOGOTIPO OFICIAL DE LA FRANQUICIA:</Text>
            <ScrollView
              style={styles.logosGridScroll}
              contentContainerStyle={styles.logosGrid}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="always"
            >
              {NBA_TEAMS_LIST.map((team) => {
                const isSelected = tempTeamAbbr === team.abbreviation;
                return (
                  <TouchableOpacity
                    key={team.abbreviation}
                    activeOpacity={0.75}
                    onPress={() => {
                      HapticsService.selectionTick();
                      setTempTeamLogo(team.logoUrl);
                      setTempTeamAbbr(team.abbreviation);
                    }}
                    style={[
                      styles.logoPill,
                      isSelected && styles.logoPillSelected,
                    ]}
                  >
                    <Image
                      source={{ uri: team.logoUrl }}
                      style={styles.logoItemImage}
                      resizeMode="contain"
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.logoItemText,
                        isSelected && styles.logoItemTextSelected,
                      ]}
                    >
                      {team.abbreviation}
                    </Text>
                    {isSelected && (
                      <View style={styles.logoCheckBadge}>
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.nameModalActions}>
              <TouchableOpacity
                onPress={() => setNameEditModalVisible(false)}
                style={styles.cancelNameBtn}
              >
                <Text style={styles.cancelNameBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveTeamCustomization}
                style={styles.saveNameBtn}
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.saveNameBtnText}>Guardar Franquicia</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  hudContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  ovrBigBox: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  ovrLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  ovrScore: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38BDF8',
  },
  hudStatsGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  hudStatBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  statLabelText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#64748B',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  synergyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 14,
  },
  synergyHeaderTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bonusesList: {
    gap: 6,
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bonusBadgePositive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  bonusBadgeWarning: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bonusBadgeCoach: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  bonusBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  teamNameHeaderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  headerLogoContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  headerTeamLogo: {
    width: '100%',
    height: '100%',
  },
  teamHeaderInfo: {
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  editPencilBadge: {
    padding: 3,
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '500',
  },
  exportHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 5,
  },
  exportHeaderBtnText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#006BB6',
  },

  // Edit Team Franchise Modal
  nameEditOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  nameEditCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  nameEditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameEditTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameEditTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  closeNameModalBtn: {
    padding: 4,
  },
  nameEditSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 15,
  },
  modalInputLabel: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  nameInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#006BB6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#0F172A',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  logosGridScroll: {
    maxHeight: 180,
    marginBottom: 14,
  },
  logosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingVertical: 2,
  },
  logoPill: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 6,
    gap: 4,
    position: 'relative',
  },
  logoPillSelected: {
    borderColor: '#006BB6',
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
  },
  logoItemImage: {
    width: 22,
    height: 22,
  },
  logoItemText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#334155',
  },
  logoItemTextSelected: {
    color: '#006BB6',
  },
  logoCheckBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#006BB6',
    borderRadius: 6,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  cancelNameBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelNameBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  saveNameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#006BB6',
  },
  saveNameBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
