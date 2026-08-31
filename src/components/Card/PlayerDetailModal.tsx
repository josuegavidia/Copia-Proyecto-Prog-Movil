import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { NBAPlayer, CardRarity } from '../../types';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { RARITY_COLORS } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

interface PlayerDetailModalProps {
  visible: boolean;
  player: NBAPlayer | null;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  onDelete?: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  visible,
  player,
  onClose,
  actionLabel,
  onAction,
  onDelete,
}) => {
  if (!visible || !player) return null;

  const team = NBA_TEAMS[player.teamAbbr] || {
    name: player.team,
    city: '',
    primaryColor: '#0284C7',
    secondaryColor: '#38BDF8',
    logoUrl: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  };

  const rarityConfig = RARITY_COLORS[player.rarity] || RARITY_COLORS.BRONZE;

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
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { borderColor: rarityConfig.border }]}>
          {/* Header Bar */}
          <View
            style={[
              styles.headerBar,
              { backgroundColor: team.primaryColor || '#0F172A' },
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
              <View>
                <Text style={styles.headerTeamName}>{team.name}</Text>
                <Text style={styles.headerTeamSub}>
                  Conferencia {player.conference} · #{player.number}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Player Main Info Box */}
            <View style={[styles.playerBanner, { backgroundColor: rarityConfig.cardBg }]}>
              {/* Headshot */}
              <View style={styles.headshotContainer}>
                <Image
                  source={{ uri: player.imageUrl }}
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
                      { backgroundColor: rarityConfig.badgeBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rarityText,
                        { color: rarityConfig.badgeText },
                      ]}
                    >
                      {rarityConfig.label}
                    </Text>
                  </View>
                  <View style={styles.posBadge}>
                    <Text style={styles.posText}>POS: {player.position}</Text>
                  </View>
                </View>

                <Text numberOfLines={1} style={styles.playerName}>
                  {player.name}
                </Text>
                {player.nickname ? (
                  <Text style={styles.playerNickname}>"{player.nickname}"</Text>
                ) : null}

                <View style={styles.ovrBigBox}>
                  <Text style={styles.ovrBigLabel}>MEDIA GENERAL</Text>
                  <Text style={styles.ovrBigVal}>{player.stats.ovr} OVR</Text>
                </View>
              </View>
            </View>

            {/* Complete Attributes Section */}
            <View style={styles.statsSection}>
              <View style={styles.sectionHeadingRow}>
                <Ionicons name="stats-chart" size={16} color="#0284C7" />
                <Text style={styles.sectionHeading}>ATRIBUTOS COMPLETOS</Text>
              </View>

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

            {/* Actions */}
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

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onClose}
                style={styles.dismissBtn}
              >
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
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    width: '100%',
    maxWidth: 360,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerTeamLogo: {
    width: 32,
    height: 32,
  },
  headerTeamName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTeamSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  closeBtn: {
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 14,
  },
  scrollContent: {
    padding: 14,
  },
  playerBanner: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  headshotContainer: {
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headshot: {
    width: '100%',
    height: '100%',
  },
  playerMeta: {
    flex: 1,
    paddingLeft: 8,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  posText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playerNickname: {
    fontSize: 11,
    color: '#E0F2FE',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  ovrBigBox: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ovrBigLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#CBD5E1',
  },
  ovrBigVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statsGrid: {
    gap: 8,
  },
  statRow: {
    gap: 3,
  },
  statLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  statValue: {
    fontSize: 12,
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
  actionsContainer: {
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 11,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dismissBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 8,
  },
  dismissBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  deleteCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  deleteCardBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DC2626',
  },
});
