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
import { SquadLineup, SquadSynergy, UserCard } from '../../types';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { getPlayerBio } from '../../data/playerBioData';
import { HapticsService } from '../../services/haptics';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

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
  teamName = 'Mi Franquicia',
  onClose,
}) => {
  const cardRef = useRef<View>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!visible) return null;

  const handleShare = async () => {
    try {
      await HapticsService.mediumImpact();
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
          dialogTitle: `🏀 Quinteto en Cancha: ${teamName}`,
          UTI: 'public.png',
        });
        setExportSuccess(true);
        await HapticsService.celebrate();
      } else {
        Alert.alert(
          'Imagen generada',
          'Tu poster de cancha clásica ha sido renderizado con éxito.'
        );
      }
    } catch (err: any) {
      Alert.alert('Error al exportar', err.message || 'No se pudo generar la imagen del quinteto.');
    } finally {
      setIsExporting(false);
    }
  };

  // Render a tactical mini card on the hardwood court
  const renderCourtPlayerCard = (
    posKey: string,
    posLabel: string,
    userCard: UserCard | null,
    isCenter: boolean = false
  ) => {
    const p = userCard?.player;
    const teamInfo = p ? NBA_TEAMS[p.teamAbbr] : null;
    const isLegend = p?.rarity === 'ICON' || p?.isLegend;
    const bio = p ? getPlayerBio(p.name, p.position, p.height, p.country, p.countryFlag) : null;

    return (
      <View
        style={[
          styles.courtCardSlot,
          isCenter && styles.courtCardSlotCenter,
          isLegend && styles.courtCardSlotLegend,
        ]}
      >
        {/* Top Position Tag */}
        <View style={[styles.courtPosBadge, isLegend && styles.courtPosBadgeLegend]}>
          <Text style={[styles.courtPosText, isLegend && { color: '#78350F' }]}>
            {posKey}
          </Text>
          <Text style={[styles.courtPosSub, isLegend && { color: '#854D0E' }]}>
            {posLabel}
          </Text>
        </View>

        {p && bio ? (
          <View style={styles.courtCardContent}>
            {/* Player Headshot with circular badge */}
            <View style={[styles.courtAvatarBox, isLegend && styles.courtAvatarBoxLegend]}>
              <Image
                source={{ uri: p.imageUrl }}
                style={styles.courtPlayerImg}
                resizeMode="contain"
              />
              {/* OVR Floating Badge */}
              <View style={[styles.courtOvrBadge, isLegend && styles.courtOvrBadgeLegend]}>
                <Text style={[styles.courtOvrNumber, isLegend && { color: '#78350F' }]}>
                  {p.stats.ovr}
                </Text>
              </View>
            </View>

            {/* Name with Flag */}
            <View style={styles.courtNameBox}>
              <Text style={{ fontSize: 11, marginRight: 2 }}>{bio.countryFlag}</Text>
              <Text numberOfLines={1} style={[styles.courtNameText, isLegend && { color: '#FEF08A' }]}>
                {p.name}
              </Text>
            </View>

            {/* Team Info & Height */}
            <View style={styles.courtMetaBox}>
              {teamInfo?.logoUrl ? (
                <Image
                  source={{ uri: teamInfo.logoUrl }}
                  style={styles.courtTeamLogo}
                  resizeMode="contain"
                />
              ) : null}
              <Text numberOfLines={1} style={styles.courtMetaText}>
                #{p.number} · {bio.height.split(' ')[0]}m
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.courtEmptySlot}>
            <Ionicons name="basketball-outline" size={24} color="#94A3B8" />
            <Text style={styles.courtEmptyText}>Sin asignar</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          {/* Top Modal Navigation Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="basketball" size={18} color="#EA580C" />
                <Text style={styles.modalTitle}>PRESUMIR EN CANCHA CLÁSICA</Text>
              </View>
              <Text style={styles.modalSubtitle}>
                Hardwood Stadium · Formación Táctica NBA
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
            {/* The Exportable Hardwood Stadium Poster */}
            <View ref={cardRef} collapsable={false} style={styles.exportPoster}>
              
              {/* 1. ARENA JUMBOTRON SCOREBOARD (MARCADOR DE ESTADIO) */}
              <View style={styles.jumbotronHeader}>
                <View style={styles.jumbotronBrand}>
                  <View style={styles.nbaLogoBadge}>
                    <Ionicons name="basketball" size={12} color="#FFFFFF" />
                    <Text style={styles.nbaLogoText}>NBA ARENA</Text>
                  </View>
                  <Text style={styles.jumbotronTitleText}>
                    {teamName.toUpperCase()}
                  </Text>
                  <View style={styles.liveMatchBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LINEUP</Text>
                  </View>
                </View>

                {/* Scoreboard HUD Display */}
                <View style={styles.scoreboardDisplay}>
                  {/* Big Digital OVR Box */}
                  <View style={styles.digitalOvrBox}>
                    <Text style={styles.digitalOvrLabel}>MEDIA GENERAL</Text>
                    <View style={styles.digitalOvrValRow}>
                      <Text style={styles.digitalOvrVal}>{synergy.totalOvr}</Text>
                      <Ionicons name="flash" size={16} color="#EAB308" />
                    </View>
                  </View>

                  {/* 3 Metrics: Química, Ataque, Defensa */}
                  <View style={styles.digitalStatsGrid}>
                    <View style={styles.digitalStatPill}>
                      <Ionicons name="sparkles" size={11} color="#EAB308" />
                      <Text style={styles.digitalStatLabel}>QUÍMICA:</Text>
                      <Text style={[styles.digitalStatVal, { color: '#EAB308' }]}>
                        {synergy.teamChemistry}%
                      </Text>
                    </View>

                    <View style={styles.digitalStatPill}>
                      <Ionicons name="flame" size={11} color="#F97316" />
                      <Text style={styles.digitalStatLabel}>ATQ:</Text>
                      <Text style={[styles.digitalStatVal, { color: '#F97316' }]}>
                        {synergy.offenseRating}
                      </Text>
                    </View>

                    <View style={styles.digitalStatPill}>
                      <Ionicons name="shield-checkmark" size={11} color="#22C55E" />
                      <Text style={styles.digitalStatLabel}>DEF:</Text>
                      <Text style={[styles.digitalStatVal, { color: '#22C55E' }]}>
                        {synergy.defenseRating}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* 2. THE HARDWOOD BASKETBALL COURT (CANCHA DE PARQUET) */}
              <View style={styles.hardwoodCourt}>
                
                {/* Court Markings (Pintura, Arco de 3, Círculo Central) */}
                <View style={styles.courtLinesLayer}>
                  {/* Half-Court Line */}
                  <View style={styles.halfCourtLine} />
                  
                  {/* Center Circle */}
                  <View style={styles.centerCircle}>
                    <Ionicons name="basketball" size={32} color="rgba(255,255,255,0.18)" />
                  </View>

                  {/* 3-Point Arc */}
                  <View style={styles.threePointArc} />

                  {/* Paint Key / Zona Pintada */}
                  <View style={styles.paintKey}>
                    <View style={styles.freeThrowCircle} />
                    <View style={styles.hoopRim}>
                      <View style={styles.hoopNet} />
                    </View>
                  </View>
                </View>

                {/* Tactical Players Formation Over Hardwood */}
                <View style={styles.tacticalGrid}>
                  
                  {/* TOP PERIMETER ROW: PG (Base) & SG (Escolta) */}
                  <View style={styles.courtRow}>
                    {renderCourtPlayerCard('PG', 'BASE', lineup.pg)}
                    {renderCourtPlayerCard('SG', 'ESCOLTA', lineup.sg)}
                  </View>

                  {/* MID WINGS ROW: SF (Alero) & PF (Ala-Pívot) */}
                  <View style={styles.courtRow}>
                    {renderCourtPlayerCard('SF', 'ALERO', lineup.sf)}
                    {renderCourtPlayerCard('PF', 'ALA-PÍVOT', lineup.pf)}
                  </View>

                  {/* BOTTOM PAINT: C (Pívot) */}
                  <View style={styles.courtRowCenter}>
                    {renderCourtPlayerCard('C', 'PÍVOT', lineup.c, true)}
                  </View>

                </View>
              </View>

              {/* 3. SIDELINE COACH BENCH (BANQUILLO TÉCNICO) */}
              <View style={styles.sidelineBenchSection}>
                <View style={styles.sidelineHeader}>
                  <Ionicons name="clipboard" size={13} color="#D97706" />
                  <Text style={styles.sidelineTitle}>BANQUILLO TÉCNICO · DIRECTOR TÉCNICO</Text>
                </View>

                {lineup.coach ? (
                  <View style={styles.coachBenchCard}>
                    {/* Coach Photo */}
                    <View style={styles.coachBenchPhotoFrame}>
                      {lineup.coach.photoUri ? (
                        <Image
                          source={{ uri: lineup.coach.photoUri }}
                          style={styles.coachBenchPhoto}
                        />
                      ) : (
                        <Ionicons name="person" size={20} color="#D97706" />
                      )}
                      <View style={styles.coachBenchDtPill}>
                        <Text style={styles.coachBenchDtText}>DT</Text>
                      </View>
                    </View>

                    {/* Coach Info */}
                    <View style={styles.coachBenchInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.coachBenchName}>Coach {lineup.coach.name}</Text>
                        <View style={styles.coachBenchTacticBadge}>
                          <Ionicons name="flash" size={8} color="#78350F" />
                          <Text style={styles.coachBenchTacticText}>{lineup.coach.tactic}</Text>
                        </View>
                      </View>

                      {/* Boosts */}
                      <View style={styles.coachBenchBoostsRow}>
                        <View style={styles.boostPill}>
                          <Text style={styles.boostPillText}>+{lineup.coach.boostOffense} ATQ</Text>
                        </View>
                        <View style={[styles.boostPill, { backgroundColor: '#064E3B', borderColor: '#059669' }]}>
                          <Text style={[styles.boostPillText, { color: '#6EE7B7' }]}>+{lineup.coach.boostDefense} DEF</Text>
                        </View>
                        <View style={[styles.boostPill, { backgroundColor: '#78350F', borderColor: '#D97706' }]}>
                          <Text style={[styles.boostPillText, { color: '#FEF08A' }]}>+{lineup.coach.boostChemistry || 10}% QUÍMICA</Text>
                        </View>
                      </View>

                      {lineup.coach.signatureQuote ? (
                        <Text numberOfLines={1} style={styles.coachBenchQuote}>
                          "{lineup.coach.signatureQuote}"
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyCoachBench}>
                    <Text style={styles.emptyCoachText}>Sin Director Técnico Asignado</Text>
                  </View>
                )}
              </View>

              {/* 4. ACTIVE SYNERGIES PILLS */}
              {synergy.teamBonuses && synergy.teamBonuses.length > 0 ? (
                <View style={styles.synergiesHardwoodBox}>
                  <View style={styles.synergiesHardwoodHeader}>
                    <Ionicons name="sparkles" size={11} color="#D97706" />
                    <Text style={styles.synergiesHardwoodTitle}>
                      {synergy.teamBonuses.length} SINERGIAS ACTIVAS EN CANCHA
                    </Text>
                  </View>
                  <View style={styles.synergiesHardwoodRow}>
                    {synergy.teamBonuses.slice(0, 3).map((b, i) => (
                      <View key={i} style={styles.hardwoodSynergyPill}>
                        <Ionicons name="checkmark-circle" size={10} color="#CA8A04" />
                        <Text numberOfLines={1} style={styles.hardwoodSynergyText}>
                          {b}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* 5. HARDWOOD WATERMARK */}
              <View style={styles.courtWatermark}>
                <View style={styles.watermarkLine} />
                <View style={styles.watermarkBadge}>
                  <Ionicons name="basketball" size={12} color="#D97706" />
                  <Text style={styles.watermarkLabel}>NBA SQUAD BUILDER · HARDWOOD EDITION</Text>
                </View>
                <View style={styles.watermarkLine} />
              </View>

            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleShare}
                disabled={isExporting}
                style={[styles.shareCourtBtn, exportSuccess && styles.shareCourtBtnSuccess]}
              >
                {isExporting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons
                      name={exportSuccess ? 'checkmark-circle' : 'share-social'}
                      size={20}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.shareCourtBtnText}>
                      {exportSuccess ? '¡Poster Compartido con Éxito!' : 'Compartir Poster de Cancha'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} onPress={onClose} style={styles.dismissCourtBtn}>
                <Text style={styles.dismissCourtText}>CERRAR</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 18, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D97706',
    width: '100%',
    maxHeight: '94%',
    overflow: 'hidden',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#334155',
    borderRadius: 20,
  },
  scrollBody: {
    padding: 12,
    paddingBottom: 24,
  },

  // ==========================================
  // HARDWOOD STADIUM POSTER EXPORT
  // ==========================================
  exportPoster: {
    backgroundColor: '#1E1B18',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#92400E',
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },

  // Arena Jumbotron
  jumbotronHeader: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#334155',
    padding: 10,
    marginBottom: 10,
    gap: 8,
  },
  jumbotronBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nbaLogoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#B91C1C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nbaLogoText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  jumbotronTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  liveMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#475569',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#22C55E',
    letterSpacing: 0.5,
  },

  // Scoreboard Display
  scoreboardDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#090D16',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  digitalOvrBox: {
    width: 80,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#EAB308',
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitalOvrLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  digitalOvrValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  digitalOvrVal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FDE047',
    letterSpacing: -1,
  },
  digitalStatsGrid: {
    flex: 1,
    gap: 4,
  },
  digitalStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#131D31',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  digitalStatLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#94A3B8',
  },
  digitalStatVal: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 'auto',
  },

  // ==========================================
  // HARDWOOD COURT STYLING (PARQUET DE MADERA)
  // ==========================================
  hardwoodCourt: {
    backgroundColor: '#A36829', // Warm polished oak parquet base
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#78350F',
    padding: 10,
    paddingVertical: 14,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  courtLinesLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  halfCourtLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  centerCircle: {
    position: 'absolute',
    top: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  threePointArc: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  paintKey: {
    position: 'absolute',
    bottom: 0,
    width: 100,
    height: 90,
    backgroundColor: 'rgba(120, 53, 15, 0.4)', // Darkened lane paint
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomWidth: 0,
    alignItems: 'center',
  },
  freeThrowCircle: {
    position: 'absolute',
    top: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  hoopRim: {
    position: 'absolute',
    bottom: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#EA580C',
    backgroundColor: 'rgba(234, 88, 12, 0.3)',
  },
  hoopNet: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 4,
  },

  // Tactical Formation
  tacticalGrid: {
    gap: 12,
    zIndex: 2,
  },
  courtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  courtRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },

  // Court Mini Card Slot
  courtCardSlot: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  courtCardSlotCenter: {
    width: '58%',
    flex: 0,
    borderColor: '#D97706',
  },
  courtCardSlotLegend: {
    backgroundColor: '#1A140E',
    borderColor: '#D97706',
    borderWidth: 1.5,
  },
  courtPosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  courtPosBadgeLegend: {
    backgroundColor: '#FEF08A',
  },
  courtPosText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#38BDF8',
  },
  courtPosSub: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#94A3B8',
  },

  courtCardContent: {
    alignItems: 'center',
    gap: 2,
  },
  courtAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  courtAvatarBoxLegend: {
    borderColor: '#FDE047',
    borderWidth: 1.5,
    backgroundColor: '#2E1E0F',
  },
  courtPlayerImg: {
    width: 44,
    height: 44,
  },
  courtOvrBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: '#0284C7',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  courtOvrBadgeLegend: {
    backgroundColor: '#FEF08A',
    borderColor: '#CA8A04',
  },
  courtOvrNumber: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  courtNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  courtNameText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  courtMetaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  courtTeamLogo: {
    width: 11,
    height: 11,
  },
  courtMetaText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  courtEmptySlot: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  courtEmptyText: {
    fontSize: 9,
    color: '#94A3B8',
    fontStyle: 'italic',
  },

  // Sideline Coach Bench
  sidelineBenchSection: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 8,
    marginBottom: 8,
    gap: 6,
  },
  sidelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  sidelineTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  coachBenchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 8,
    gap: 8,
  },
  coachBenchPhotoFrame: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  coachBenchPhoto: {
    width: 38,
    height: 38,
  },
  coachBenchDtPill: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#78350F',
    paddingHorizontal: 3,
    borderRadius: 3,
  },
  coachBenchDtText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FEF08A',
  },
  coachBenchInfo: {
    flex: 1,
    gap: 2,
  },
  coachBenchName: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  coachBenchTacticBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF08A',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  coachBenchTacticText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#78350F',
  },
  coachBenchBoostsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 1,
  },
  boostPill: {
    backgroundColor: '#7C2D12',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#EA580C',
  },
  boostPillText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#FDBA74',
  },
  coachBenchQuote: {
    fontSize: 9,
    color: '#D97706',
    fontStyle: 'italic',
    marginTop: 1,
  },
  emptyCoachBench: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  emptyCoachText: {
    fontSize: 9.5,
    color: '#64748B',
    fontStyle: 'italic',
  },

  // Active Synergies Strip
  synergiesHardwoodBox: {
    backgroundColor: '#1E1B18',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#78350F',
    padding: 8,
    marginBottom: 8,
    gap: 4,
  },
  synergiesHardwoodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  synergiesHardwoodTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FDE047',
    letterSpacing: 0.5,
  },
  synergiesHardwoodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  hardwoodSynergyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#2E1E0F',
    borderWidth: 1,
    borderColor: '#92400E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hardwoodSynergyText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FEF08A',
  },

  // Watermark
  courtWatermark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  watermarkLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#475569',
  },
  watermarkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  watermarkLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },

  // Action Buttons
  bottomActions: {
    marginTop: 12,
    gap: 8,
  },
  shareCourtBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    borderRadius: 12,
    paddingVertical: 13,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  shareCourtBtnSuccess: {
    backgroundColor: '#16A34A',
  },
  shareCourtBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dismissCourtBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  dismissCourtText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
  },
});
