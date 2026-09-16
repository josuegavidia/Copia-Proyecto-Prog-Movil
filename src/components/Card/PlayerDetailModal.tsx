import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { NBAPlayer } from '../../types';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { RARITY_COLORS } from '../../theme/colors';
import { getPlayerDescription } from '../../utils/playerLore';
import { getPlayerDossier } from '../../utils/playerDossier';
import { getPlayerFallbackHeadshotUrl, FALLBACK_HEADSHOT_URL } from '../../utils/imageUtils';
import { Ionicons } from '@expo/vector-icons';

interface PlayerDetailModalProps {
  visible: boolean;
  player: NBAPlayer | null;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  onDelete?: () => void;
}

type ModalTab = 'BIO' | 'STATS' | 'TRANSFERS' | 'AWARDS';

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  visible,
  player,
  onClose,
  actionLabel,
  onAction,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('BIO');
  const [imgUrl, setImgUrl] = useState<string>(player?.imageUrl || '');

  useEffect(() => {
    if (player) {
      setImgUrl(player.imageUrl);
      setActiveTab('BIO');
    }
  }, [player]);

  if (!visible || !player) return null;

  const team = NBA_TEAMS[player.teamAbbr] || {
    name: player.team,
    city: '',
    primaryColor: '#0284C7',
    secondaryColor: '#38BDF8',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  };

  const rarityConfig = RARITY_COLORS[player.rarity] || RARITY_COLORS.BRONZE;
  const isIcon = player.rarity === 'ICON' || player.isLegend;
  const dossier = getPlayerDossier(player);

  const statsList = [
    { label: 'Triple (3PT)', value: player.stats.threePoint, color: '#38BDF8' },
    { label: 'Clavada (DNK)', value: player.stats.dunk, color: '#F97316' },
    { label: 'Velocidad (SPD)', value: player.stats.speed, color: '#EAB308' },
    { label: 'Defensa (DEF)', value: player.stats.defense, color: '#22C55E' },
    { label: 'Pase (PLY)', value: player.stats.playmaking, color: '#A855F7' },
    { label: 'Rebote (REB)', value: player.stats.rebound, color: '#EC4899' },
    { label: 'Ataque General (OFF)', value: player.stats.offense, color: '#EF4444' },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalCard,
            {
              borderColor: isIcon ? '#D4AF37' : rarityConfig.border,
              borderWidth: isIcon ? 2.5 : 2,
            },
          ]}
        >
          {/* Header Bar */}
          <View
            style={[
              styles.headerBar,
              { backgroundColor: isIcon ? '#1E293B' : (team.primaryColor || '#0F172A') },
            ]}
          >
            <View style={styles.headerTeamRow}>
              {team.logoUrl ? (
                <Image
                  source={{ uri: team.logoUrl }}
                  style={styles.headerTeamLogo}
                  resizeMode="contain"
                />
              ) : null}
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={[styles.headerTeamName, isIcon && { color: '#FEF08A' }]}>
                  {player.classicTeamYear ? `${team.name} (${player.classicTeamYear})` : team.name}
                </Text>
                <Text style={styles.headerTeamSub}>
                  {isIcon ? 'QUINTETO HISTÓRICO' : `Conferencia ${player.conference}`} · #{player.number}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Player Hero Card Header */}
          <View
            style={[
              styles.playerBanner,
              {
                backgroundColor: isIcon ? '#FEFCE8' : rarityConfig.cardBg,
                borderColor: isIcon ? '#CA8A04' : 'transparent',
                borderWidth: isIcon ? 1 : 0,
              },
            ]}
          >
            {/* Headshot */}
            <View style={styles.headshotContainer}>
              <Image
                source={{ uri: imgUrl }}
                onError={() => {
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
                }}
                style={styles.headshot}
                resizeMode="contain"
              />
            </View>

            {/* Basic Details */}
            <View style={styles.playerMeta}>
              <View style={styles.rarityRow}>
                <View
                  style={[
                    styles.rarityPill,
                    { backgroundColor: isIcon ? '#FEF08A' : rarityConfig.badgeBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.rarityText,
                      { color: isIcon ? '#713F12' : rarityConfig.badgeText },
                    ]}
                  >
                    {isIcon ? 'ICONO LEYENDA' : rarityConfig.label}
                  </Text>
                </View>
                <View style={[styles.posBadge, isIcon && { backgroundColor: '#1E293B' }]}>
                  <Text style={styles.posText}>POS: {player.position}</Text>
                </View>
              </View>

              <Text numberOfLines={1} style={[styles.playerName, isIcon && { color: '#0F172A' }]}>
                {player.name}
              </Text>
              {player.nickname ? (
                <Text numberOfLines={1} style={[styles.playerNickname, isIcon && { color: '#B45309' }]}>
                  "{player.nickname}"
                </Text>
              ) : null}

              <View
                style={[
                  styles.ovrBigBox,
                  isIcon && { backgroundColor: '#FEF08A', borderColor: '#CA8A04', borderWidth: 1 },
                ]}
              >
                <Text style={[styles.ovrBigLabel, isIcon && { color: '#854D0E' }]}>MEDIA GENERAL</Text>
                <Text style={[styles.ovrBigVal, isIcon && { color: '#713F12' }]}>
                  {player.stats.ovr} OVR
                </Text>
              </View>
            </View>
          </View>

          {/* Dossier Tabs: BIO, STATS, FICHAJES (Transfermarkt), PREMIOS */}
          <View style={styles.tabNavRow}>
            <TouchableOpacity
              onPress={() => setActiveTab('BIO')}
              style={[styles.tabNavItem, activeTab === 'BIO' && styles.tabNavItemActive]}
            >
              <Ionicons
                name="person-outline"
                size={13}
                color={activeTab === 'BIO' ? '#0284C7' : '#64748B'}
              />
              <Text style={[styles.tabNavText, activeTab === 'BIO' && styles.tabNavTextActive]}>
                Biografía
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('STATS')}
              style={[styles.tabNavItem, activeTab === 'STATS' && styles.tabNavItemActive]}
            >
              <Ionicons
                name="stats-chart-outline"
                size={13}
                color={activeTab === 'STATS' ? '#0284C7' : '#64748B'}
              />
              <Text style={[styles.tabNavText, activeTab === 'STATS' && styles.tabNavTextActive]}>
                Estadísticas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('TRANSFERS')}
              style={[styles.tabNavItem, activeTab === 'TRANSFERS' && styles.tabNavItemActive]}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={13}
                color={activeTab === 'TRANSFERS' ? '#0284C7' : '#64748B'}
              />
              <Text style={[styles.tabNavText, activeTab === 'TRANSFERS' && styles.tabNavTextActive]}>
                Fichajes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('AWARDS')}
              style={[styles.tabNavItem, activeTab === 'AWARDS' && styles.tabNavItemActive]}
            >
              <Ionicons
                name="trophy-outline"
                size={13}
                color={activeTab === 'AWARDS' ? '#CA8A04' : '#64748B'}
              />
              <Text style={[styles.tabNavText, activeTab === 'AWARDS' && styles.tabNavTextActiveAwards]}>
                Palmarés
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content Body */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 1. BIOGRAFIA & PERFIL TACTICO */}
            {activeTab === 'BIO' && (
              <View style={styles.tabPane}>
                {/* Moment and Story */}
                <View style={styles.loreBox}>
                  <View style={styles.loreHeader}>
                    <Ionicons name="document-text-outline" size={14} color="#0284C7" />
                    <Text style={styles.loreTitle}>MOMENTO & DESEMPEÑO DESTACADO</Text>
                  </View>
                  <Text style={styles.loreText}>{getPlayerDescription(player)}</Text>
                </View>

                {/* Tactical Profile Cards */}
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconBox}>
                      <Ionicons name="basketball-outline" size={15} color="#0284C7" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>ROL TÁCTICO</Text>
                      <Text style={styles.infoVal}>{dossier.tacticalRole}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIconBox}>
                      <Ionicons name="flash-outline" size={15} color="#EAB308" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>ESPECIALIDAD TÉCNICA</Text>
                      <Text style={styles.infoVal}>{dossier.specialty}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIconBox}>
                      <Ionicons name="shield-outline" size={15} color="#10B981" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>ESTILO DE JUEGO</Text>
                      <Text style={styles.infoVal}>{dossier.playStyle}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* 2. ESTADISTICAS & ATRIBUTOS COMPLETOS */}
            {activeTab === 'STATS' && (
              <View style={styles.tabPane}>
                {/* Season / Peak Averages Grid */}
                <Text style={styles.sectionSubtitle}>PROMEDIOS POR PARTIDO (TEMPORADA DESTACADA)</Text>
                <View style={styles.averagesGrid}>
                  <View style={styles.avgBox}>
                    <Text style={styles.avgVal}>{dossier.seasonAverages.pts}</Text>
                    <Text style={styles.avgLabel}>PTS</Text>
                  </View>
                  <View style={styles.avgBox}>
                    <Text style={styles.avgVal}>{dossier.seasonAverages.reb}</Text>
                    <Text style={styles.avgLabel}>REB</Text>
                  </View>
                  <View style={styles.avgBox}>
                    <Text style={styles.avgVal}>{dossier.seasonAverages.ast}</Text>
                    <Text style={styles.avgLabel}>AST</Text>
                  </View>
                  <View style={styles.avgBox}>
                    <Text style={styles.avgVal}>{dossier.seasonAverages.stl}</Text>
                    <Text style={styles.avgLabel}>ROB</Text>
                  </View>
                  <View style={styles.avgBox}>
                    <Text style={styles.avgVal}>{dossier.seasonAverages.blk}</Text>
                    <Text style={styles.avgLabel}>BLQ</Text>
                  </View>
                  <View style={styles.avgBox}>
                    <Text style={styles.avgVal}>{dossier.seasonAverages.fgPct}</Text>
                    <Text style={styles.avgLabel}>%TC</Text>
                  </View>
                  <View style={styles.avgBox}>
                    <Text style={styles.avgVal}>{dossier.seasonAverages.threePct}</Text>
                    <Text style={styles.avgLabel}>%3P</Text>
                  </View>
                  <View style={styles.avgBox}>
                    <Text style={styles.avgVal}>{dossier.seasonAverages.ftPct}</Text>
                    <Text style={styles.avgLabel}>%TL</Text>
                  </View>
                </View>

                {/* 2K Full Attribute Bars */}
                <Text style={[styles.sectionSubtitle, { marginTop: 12 }]}>ATRIBUTOS COMPLETOS NBA 2K</Text>
                <View style={styles.statsGrid}>
                  {statsList.map((stat, idx) => {
                    const percent = Math.min(100, Math.max(10, stat.value));
                    return (
                      <View key={idx} style={styles.statRow}>
                        <View style={styles.statLabelRow}>
                          <Text style={styles.statLabel}>{stat.label}</Text>
                          <Text style={styles.statValue}>{stat.value}</Text>
                        </View>
                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.barFill,
                              {
                                width: `${percent}%`,
                                backgroundColor: stat.color,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 3. HISTORIAL DE FICHAJES & MOVIMIENTOS (TRANSFERMARKT STYLE) */}
            {activeTab === 'TRANSFERS' && (
              <View style={styles.tabPane}>
                {/* Draft Badge Card */}
                <View style={styles.draftCard}>
                  <View style={styles.draftHeader}>
                    <Ionicons name="school" size={16} color="#006BB6" />
                    <Text style={styles.draftTitle}>SELECCIÓN DEL DRAFT NBA</Text>
                  </View>
                  <View style={styles.draftBody}>
                    {dossier.draftInfo.teamLogo ? (
                      <Image
                        source={{ uri: dossier.draftInfo.teamLogo }}
                        style={styles.draftTeamLogo}
                        resizeMode="contain"
                      />
                    ) : null}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.draftMainText}>
                        Año {dossier.draftInfo.year} · Pick #{dossier.draftInfo.pick} (Ronda {dossier.draftInfo.round})
                      </Text>
                      <Text style={styles.draftSubText}>
                        Seleccionado por: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{dossier.draftInfo.teamName}</Text>
                      </Text>
                      <Text style={styles.draftOriginText}>
                        Procedencia: {dossier.draftInfo.origin}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Transfermarkt Movements Banner */}
                <View style={styles.tmBanner}>
                  <View style={styles.tmBannerHeader}>
                    <Text style={styles.tmBannerTitle}>HISTORIAL DE FICHAJES</Text>
                  </View>
                  <View style={styles.tmInfoBox}>
                    <Ionicons name="information-circle" size={16} color="#006BB6" style={{ marginTop: 1 }} />
                    <Text style={styles.tmInfoText}>
                      Aquí se muestra el historial completo de traspasos, contratos y draft de {player.name} con escudos oficiales.
                    </Text>
                  </View>

                  {/* Transfer Table Header */}
                  <View style={styles.tmTableHeader}>
                    <Text style={[styles.tmTh, { width: 44 }]}>Temp.</Text>
                    <Text style={[styles.tmTh, { width: 68 }]}>Fecha</Text>
                    <Text style={[styles.tmTh, { flex: 1 }]}>Último club</Text>
                    <Text style={[styles.tmTh, { flex: 1 }]}>Nuevo club</Text>
                    <Text style={[styles.tmTh, { width: 72, textAlign: 'right' }]}>Valor / Coste</Text>
                  </View>

                  {/* Transfer Rows */}
                  {dossier.transfers.map((mov, idx) => {
                    const toTeamInfo = mov.toTeamAbbr ? NBA_TEAMS[mov.toTeamAbbr] : null;
                    const fromTeamInfo = mov.fromTeamAbbr ? NBA_TEAMS[mov.fromTeamAbbr] : null;

                    return (
                      <View
                        key={idx}
                        style={[
                          styles.tmTableRow,
                          idx % 2 === 1 && { backgroundColor: '#F8FAFC' },
                        ]}
                      >
                        <Text style={[styles.tmTdTemp, { width: 44 }]}>{mov.season}</Text>
                        <Text style={[styles.tmTdDate, { width: 68 }]}>{mov.date}</Text>

                        {/* From Club */}
                        <View style={[styles.tmClubCell, { flex: 1 }]}>
                          {fromTeamInfo?.logoUrl ? (
                            <Image
                              source={{ uri: fromTeamInfo.logoUrl }}
                              style={styles.tmClubLogo}
                              resizeMode="contain"
                            />
                          ) : (
                            <Ionicons name="shield-outline" size={14} color="#94A3B8" style={{ marginRight: 3 }} />
                          )}
                          <Text numberOfLines={1} style={styles.tmClubName}>
                            {fromTeamInfo ? fromTeamInfo.abbreviation : mov.fromTeam}
                          </Text>
                        </View>

                        {/* To Club */}
                        <View style={[styles.tmClubCell, { flex: 1 }]}>
                          {toTeamInfo?.logoUrl ? (
                            <Image
                              source={{ uri: toTeamInfo.logoUrl }}
                              style={styles.tmClubLogo}
                              resizeMode="contain"
                            />
                          ) : (
                            <Ionicons name="shield-outline" size={14} color="#006BB6" style={{ marginRight: 3 }} />
                          )}
                          <Text numberOfLines={1} style={[styles.tmClubName, { fontWeight: '700', color: '#0F172A' }]}>
                            {toTeamInfo ? toTeamInfo.abbreviation : mov.toTeam}
                          </Text>
                        </View>

                        {/* Value / Fee Type */}
                        <View style={{ width: 72, alignItems: 'flex-end' }}>
                          {mov.marketValue ? (
                            <Text numberOfLines={1} style={styles.tmValueText}>{mov.marketValue}</Text>
                          ) : null}
                          <Text numberOfLines={1} style={styles.tmFeeText}>{mov.feeOrType}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 4. PALMARES, PREMIOS & DISTINCIONES */}
            {activeTab === 'AWARDS' && (
              <View style={styles.tabPane}>
                <Text style={styles.sectionSubtitle}>PALMARÉS & RECONOCIMIENTOS OFICIALES</Text>
                <View style={styles.awardsList}>
                  {dossier.awards.map((award, idx) => (
                    <View key={idx} style={styles.awardCard}>
                      <View style={styles.awardIconBox}>
                        <Ionicons name={award.icon as any || 'trophy'} size={18} color="#B45309" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.awardTitleRow}>
                          <Text style={styles.awardName}>{award.name}</Text>
                          {award.count ? (
                            <View style={styles.awardCountBadge}>
                              <Text style={styles.awardCountText}>x{award.count}</Text>
                            </View>
                          ) : null}
                        </View>
                        {award.details ? (
                          <Text style={styles.awardDetails}>{award.details}</Text>
                        ) : null}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {onAction && actionLabel ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    onAction();
                    onClose();
                  }}
                  style={styles.actionBtn}
                >
                  <Ionicons name="swap-horizontal" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>{actionLabel}</Text>
                </TouchableOpacity>
              ) : null}

              {onDelete ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    Alert.alert(
                      'Eliminar Carta',
                      `¿Estás seguro de que deseas eliminar a ${player.name} de tu colección?`,
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Eliminar',
                          style: 'destructive',
                          onPress: () => {
                            onDelete();
                            onClose();
                          },
                        },
                      ]
                    );
                  }}
                  style={styles.deleteCardBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#DC2626" style={{ marginRight: 6 }} />
                  <Text style={styles.deleteCardBtnText}>Eliminar de mi Colección</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity activeOpacity={0.85} onPress={onClose} style={styles.dismissBtn}>
                <Text style={styles.dismissBtnText}>CERRAR</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    width: '100%',
    maxHeight: '92%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  headerTeamLogo: {
    width: 28,
    height: 28,
  },
  headerTeamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTeamSub: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeBtn: {
    padding: 4,
  },

  // Player Banner
  playerBanner: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  headshotContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headshot: {
    width: 80,
    height: 80,
  },
  playerMeta: {
    flex: 1,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  rarityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  posBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  posText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  playerNickname: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  ovrBigBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  ovrBigLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  ovrBigVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1D4ED8',
  },

  // Tab Navigation
  tabNavRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  tabNavItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    gap: 4,
  },
  tabNavItemActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: '#006BB6',
    backgroundColor: '#FFFFFF',
  },
  tabNavText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabNavTextActive: {
    color: '#006BB6',
    fontWeight: 'bold',
  },
  tabNavTextActiveAwards: {
    color: '#B45309',
    fontWeight: 'bold',
  },

  // Content Body
  scrollContent: {
    padding: 12,
    paddingBottom: 20,
  },
  tabPane: {
    gap: 12,
  },

  // Lore / BIO
  loreBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0284C7',
  },
  loreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  loreTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#0369A1',
  },
  loreText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748B',
  },
  infoVal: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F172A',
  },

  // Stats
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  averagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  avgBox: {
    width: '23%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avgVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  avgLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  statsGrid: {
    gap: 6,
  },
  statRow: {
    gap: 2,
  },
  statLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Draft Card
  draftCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 8,
  },
  draftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  draftTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#006BB6',
    letterSpacing: 0.3,
  },
  draftBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  draftTeamLogo: {
    width: 38,
    height: 38,
  },
  draftMainText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  draftSubText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  draftOriginText: {
    fontSize: 10.5,
    color: '#64748B',
    fontStyle: 'italic',
  },

  // Transfermarkt Table
  tmBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0A3871',
    overflow: 'hidden',
  },
  tmBannerHeader: {
    backgroundColor: '#0A3871', // Transfermarkt dark blue header
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tmBannerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tmInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tmInfoText: {
    fontSize: 10,
    color: '#0369A1',
    flex: 1,
    lineHeight: 14,
  },
  tmTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tmTh: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  tmTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tmTdTemp: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  tmTdDate: {
    fontSize: 9.5,
    color: '#64748B',
  },
  tmClubCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 4,
  },
  tmClubLogo: {
    width: 14,
    height: 14,
  },
  tmClubName: {
    fontSize: 10,
    color: '#334155',
  },
  tmValueText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  tmFeeText: {
    fontSize: 8.5,
    color: '#0284C7',
    fontWeight: '600',
  },

  // Awards
  awardsList: {
    gap: 8,
  },
  awardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FEF08A',
    gap: 10,
  },
  awardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  awardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  awardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#854D0E',
    flex: 1,
  },
  awardCountBadge: {
    backgroundColor: '#CA8A04',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  awardCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  awardDetails: {
    fontSize: 10.5,
    color: '#A16207',
    marginTop: 1,
  },

  // Actions
  actionsContainer: {
    marginTop: 14,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: '#006BB6',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  deleteCardBtn: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteCardBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dismissBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtnText: {
    color: '#64748B',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
