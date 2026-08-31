import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SquadLineup, SquadSynergy } from '../../types';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { THEME } from '../../theme/colors';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Ionicon } from '../Common/Ionicon';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SquadExportModalProps {
  visible: boolean;
  lineup: SquadLineup;
  synergy: SquadSynergy;
  teamName?: string;
  onClose: () => void;
}

export const SquadExportModal: React.FC<SquadExportModalProps> = ({
  visible,
  lineup,
  synergy,
  teamName = 'Mi Quinteto',
  onClose,
}) => {
  const cardRef = useRef<View>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!visible) return null;

  const starters = [
    { pos: 'BASE (PG)', card: lineup.pg },
    { pos: 'ESCOLTA (SG)', card: lineup.sg },
    { pos: 'ALERO (SF)', card: lineup.sf },
    { pos: 'ALA-PÍVOT (PF)', card: lineup.pf },
    { pos: 'PÍVOT (C)', card: lineup.c },
  ];

  const handleShare = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);

      if (!cardRef.current) {
        throw new Error('Ref no disponible');
      }

      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Presume tu Quinteto: ${teamName}`,
          UTI: 'public.png',
        });
        setExportSuccess(true);
      } else {
        Alert.alert(
          'Imagen generada',
          'Tu imagen ha sido renderizada con éxito. (Compartir no está disponible en este entorno).'
        );
      }
    } catch (err: any) {
      Alert.alert('Error al exportar', err.message || 'No se pudo generar la imagen del quinteto.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>PRESUMIR QUINTETO</Text>
              <Text style={styles.subtitle}>
                Exporta tu alineación + DT en alta resolución
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* The Exportable Visual Card */}
            <View ref={cardRef} collapsable={false} style={styles.exportCard}>
              {/* Broadcast Header */}
              <View style={styles.cardHeader}>
                <View style={styles.brandRow}>
                  <View style={styles.nbaPill}>
                    <Text style={styles.nbaPillText}>NBA SQUAD</Text>
                  </View>
                  <Text style={styles.cardHeaderTitle}>{teamName.toUpperCase()}</Text>
                </View>

                {/* Team Badges Row */}
                <View style={styles.hudBadgesRow}>
                  <View style={styles.ovrBadge}>
                    <Text style={styles.ovrLabel}>OVR</Text>
                    <Text style={styles.ovrValue}>{synergy.totalOvr}</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Ionicon name="flash" size={11} color="#CA8A04" />
                    <Text style={styles.statChipText}>QUÍMICA {synergy.teamChemistry}%</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Ionicon name="flame" size={11} color="#EA580C" />
                    <Text style={styles.statChipText}>ATQ {synergy.offenseRating}</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Ionicon name="shield-checkmark" size={11} color="#16A34A" />
                    <Text style={styles.statChipText}>DEF {synergy.defenseRating}</Text>
                  </View>
                </View>
              </View>

              {/* 5 Starting Players Section */}
              <View style={styles.startersSection}>
                <Text style={styles.sectionLabel}>QUINTETO TITULAR</Text>
                <View style={styles.startersList}>
                  {starters.map((item, idx) => {
                    const p = item.card?.player;
                    const teamInfo = p ? NBA_TEAMS[p.teamAbbr] : null;
                    return (
                      <View key={idx} style={styles.starterRow}>
                        <View style={styles.posPill}>
                          <Text style={styles.posPillText}>{item.pos.split(' ')[1] || item.pos}</Text>
                        </View>

                        {p ? (
                          <View style={styles.playerInfoRow}>
                            <Image
                              source={{ uri: p.imageUrl }}
                              style={styles.playerAvatar}
                              resizeMode="contain"
                            />
                            <View style={styles.playerDetails}>
                              <Text numberOfLines={1} style={styles.playerName}>
                                {p.name}
                              </Text>
                              <View style={styles.teamTagRow}>
                                {teamInfo?.logoUrl && (
                                  <Image
                                    source={{ uri: teamInfo.logoUrl }}
                                    style={styles.smallTeamLogo}
                                    resizeMode="contain"
                                  />
                                )}
                                <Text style={styles.teamAbbrText}>{p.teamAbbr} · #{p.number}</Text>
                              </View>
                            </View>
                            <View style={styles.playerOvrBadge}>
                              <Text style={styles.playerOvrText}>{p.stats.ovr}</Text>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.emptyPlayerRow}>
                            <Text style={styles.emptySlotText}>Slot Vacío</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Head Coach Section */}
              <View style={styles.coachExportSection}>
                <Text style={styles.sectionLabel}>DIRECTOR TÉCNICO</Text>
                {lineup.coach ? (
                  <View style={styles.coachContent}>
                    {lineup.coach.photoUri ? (
                      <Image
                        source={{ uri: lineup.coach.photoUri }}
                        style={styles.coachAvatar}
                      />
                    ) : (
                      <View style={styles.coachAvatarPlaceholder}>
                        <Ionicon name="person" size={20} color="#006BB6" />
                      </View>
                    )}
                    <View style={styles.coachDetails}>
                      <Text style={styles.coachNameText}>Coach {lineup.coach.name}</Text>
                      <Text style={styles.coachTacticText}>
                        Táctica: {lineup.coach.tactic} (+{lineup.coach.boostOffense} ATQ / +{lineup.coach.boostDefense} DEF)
                      </Text>
                      {lineup.coach.signatureQuote ? (
                        <Text numberOfLines={1} style={styles.coachQuote}>
                          "{lineup.coach.signatureQuote}"
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.coachBadge}>
                      <Text style={styles.coachBadgeText}>DT</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.noCoachText}>Sin Director Técnico Asignado</Text>
                )}
              </View>

              {/* Active Synergies Footer Strip */}
              {synergy.teamBonuses.length > 0 && (
                <View style={styles.synergiesStrip}>
                  <View style={styles.synergiesHeader}>
                    <Ionicon name="sparkles" size={11} color="#CA8A04" />
                    <Text style={styles.synergiesHeaderText}>
                      {synergy.teamBonuses.length} SINERGIAS ACTIVAS
                    </Text>
                  </View>
                  <View style={styles.synergiesPillsRow}>
                    {synergy.teamBonuses.slice(0, 3).map((b, i) => (
                      <View key={i} style={styles.synergyPill}>
                        <Text numberOfLines={1} style={styles.synergyPillText}>
                          {b}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Watermark Footer */}
              <View style={styles.cardWatermark}>
                <Text style={styles.watermarkText}>CREADO CON NBA SQUAD BUILDER</Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionsFooter}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleShare}
              disabled={isExporting}
              style={styles.shareButton}
            >
              {isExporting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="share-social-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.shareButtonText}>Compartir Imagen</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  scrollBody: {
    padding: 16,
    alignItems: 'center',
  },

  // Export Card Container
  exportCard: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F58426', // Knicks Orange border
    padding: 14,
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nbaPill: {
    backgroundColor: '#006BB6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  nbaPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardHeaderTitle: {
    color: '#F58426',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hudBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  ovrBadge: {
    backgroundColor: '#006BB6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  ovrLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#E0F2FE',
  },
  ovrValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statChipText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  sectionLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  // Starters
  startersSection: {
    marginBottom: 10,
  },
  startersList: {
    gap: 5,
  },
  starterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  posPill: {
    width: 32,
    backgroundColor: '#006BB6',
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  posPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  playerInfoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  teamTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  smallTeamLogo: {
    width: 12,
    height: 12,
  },
  teamAbbrText: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  playerOvrBadge: {
    backgroundColor: '#F58426',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  playerOvrText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  emptyPlayerRow: {
    flex: 1,
    paddingVertical: 6,
  },
  emptySlotText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },

  // Coach Section
  coachExportSection: {
    backgroundColor: 'rgba(0, 107, 182, 0.15)',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 107, 182, 0.4)',
    marginBottom: 8,
  },
  coachContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#006BB6',
  },
  coachAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  coachDetails: {
    flex: 1,
  },
  coachNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  coachTacticText: {
    fontSize: 9.5,
    color: '#38BDF8',
    marginTop: 1,
  },
  coachQuote: {
    fontSize: 8.5,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  coachBadge: {
    backgroundColor: '#006BB6',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  coachBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  noCoachText: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
  },

  // Synergies Strip
  synergiesStrip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    padding: 6,
    marginBottom: 8,
  },
  synergiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  synergiesHeaderText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#CA8A04',
  },
  synergiesPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  synergyPill: {
    backgroundColor: 'rgba(202, 138, 4, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(202, 138, 4, 0.3)',
  },
  synergyPillText: {
    fontSize: 8.5,
    color: '#FEF08A',
    fontWeight: '600',
  },

  cardWatermark: {
    alignItems: 'center',
    paddingTop: 4,
  },
  watermarkText: {
    fontSize: 7.5,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },

  // Footer Actions
  actionsFooter: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006BB6',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
