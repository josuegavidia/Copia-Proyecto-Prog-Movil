import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SquadLineup, SquadSynergy } from '../../types';
import { HapticsService } from '../../services/haptics';
import { SoundService } from '../../services/sound';
import { Ionicons } from '@expo/vector-icons';
import { Ionicon } from '../Common/Ionicon';

const OPPONENT_TEAMS = [
  { name: 'Boston Celtics', ovr: 96, teamAbbr: 'BOS' },
  { name: 'Denver Nuggets', ovr: 95, teamAbbr: 'DEN' },
  { name: 'OKC Thunder', ovr: 94, teamAbbr: 'OKC' },
  { name: 'LA Lakers', ovr: 92, teamAbbr: 'LAL' },
  { name: 'GS Warriors', ovr: 91, teamAbbr: 'GSW' },
];

interface QuickMatchModalProps {
  visible: boolean;
  lineup: SquadLineup;
  synergy: SquadSynergy;
  onClose: () => void;
  onRewardEarned: (coins: number) => void;
}

type MatchStatus = 'READY' | 'PLAYING' | 'FINISHED';

export const QuickMatchModal: React.FC<QuickMatchModalProps> = ({
  visible,
  lineup,
  synergy,
  onClose,
  onRewardEarned,
}) => {
  const [selectedOpponent, setSelectedOpponent] = useState(OPPONENT_TEAMS[0]);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('READY');
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [quarterLogs, setQuarterLogs] = useState<string[]>([]);

  if (!visible) return null;

  const handleStartMatch = async () => {
    setMatchStatus('PLAYING');
    setQuarterLogs([]);
    let currentMy = 0;
    let currentOpp = 0;
    const logs: string[] = [];

    const userOvr = synergy.totalOvr;
    const chemBonus = ((synergy.teamChemistry - 80) / 20) * 1.0;
    const coachBonus = (((lineup.coach?.boostOffense || 0) + (lineup.coach?.boostDefense || 0)) / 8) * 0.8;
    const userPower = userOvr + chemBonus + coachBonus;
    const oppPower = selectedOpponent.ovr + 0.25;
    const diff = userPower - oppPower;

    for (let q = 1; q <= 4; q++) {
      await new Promise((r) => setTimeout(r, 600));
      await HapticsService.selectionTick();

      const baseMy = Math.floor(Math.random() * 6) + 24;
      const baseOpp = Math.floor(Math.random() * 6) + 24;

      const qMyAdvantage = Math.round(diff * 0.45);
      const randomSwing = Math.floor(Math.random() * 5) - 2;

      let qMy = baseMy + qMyAdvantage + randomSwing;
      let qOpp = baseOpp - qMyAdvantage - randomSwing;

      qMy = Math.max(18, Math.min(36, qMy));
      qOpp = Math.max(18, Math.min(36, qOpp));

      currentMy += qMy;
      currentOpp += qOpp;
      setMyScore(currentMy);
      setOppScore(currentOpp);

      logs.push(`Cuarto ${q}: Tu Equipo ${qMy} - ${qOpp} ${selectedOpponent.name}`);
      setQuarterLogs([...logs]);
    }

    if (currentMy === currentOpp) {
      if (diff >= 0) {
        if (Math.random() < 0.5 + diff * 0.05) {
          currentMy += 4;
          currentOpp += 2;
        } else {
          currentMy += 2;
          currentOpp += 4;
        }
      } else {
        if (Math.random() < 0.5 + Math.abs(diff) * 0.05) {
          currentOpp += 4;
          currentMy += 2;
        } else {
          currentOpp += 2;
          currentMy += 4;
        }
      }
      setMyScore(currentMy);
      setOppScore(currentOpp);
    }

    setMatchStatus('FINISHED');

    const won = currentMy > currentOpp;
    const coinsWon = won ? 350 : 120;

    if (won) {
      SoundService.playVictory();
      await HapticsService.celebrate();
    } else {
      await HapticsService.packTearProgress(0.8);
    }

    onRewardEarned(coinsWon);
  };

  const handleClose = () => {
    setMatchStatus('READY');
    setMyScore(0);
    setOppScore(0);
    setQuarterLogs([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleWrap}>
              <Ionicons name="flash" size={20} color="#0284C7" />
              <Text style={styles.headerTitle}>SIMULADOR DE PARTIDO RÁPIDO</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Pre-Match */}
          {matchStatus === 'READY' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Matchup Banner */}
              <View style={styles.matchupBanner}>
                <View style={styles.teamBox}>
                  <Text style={styles.teamLabel}>TU QUINTETO</Text>
                  <Text style={styles.teamOvr}>{synergy.totalOvr} OVR</Text>
                  <Text style={styles.teamChem}>Química: {synergy.teamChemistry}%</Text>
                </View>

                <Text style={styles.vsText}>VS</Text>

                <View style={styles.teamBox}>
                  <Text style={styles.teamLabel}>{selectedOpponent.name}</Text>
                  <Text style={styles.oppOvr}>{selectedOpponent.ovr} OVR</Text>
                  <Text style={styles.teamChem}>Dificultad NBA</Text>
                </View>
              </View>

              {/* Opponent Selector */}
              <Text style={styles.sectionTitle}>ELEGIR RIVAL</Text>
              <View style={styles.opponentsGrid}>
                {OPPONENT_TEAMS.map((opp) => (
                  <TouchableOpacity
                    key={opp.teamAbbr}
                    onPress={() => setSelectedOpponent(opp)}
                    style={[
                      styles.oppPill,
                      selectedOpponent.teamAbbr === opp.teamAbbr &&
                        styles.oppPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.oppPillText,
                        selectedOpponent.teamAbbr === opp.teamAbbr &&
                          styles.oppPillTextActive,
                      ]}
                    >
                      {opp.name} ({opp.ovr})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Reward info */}
              <View style={styles.rewardBanner}>
                <Ionicons name="trophy" size={16} color="#CA8A04" />
                <Text style={styles.rewardText}>
                  Recompensa: <Text style={styles.rewardBold}>+350 Monedas</Text> por victoria / +120 por jugar
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleStartMatch}
                style={styles.playButton}
              >
                <Text style={styles.playButtonText}>¡SIMULAR PARTIDO!</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Playing / Finished */}
          {(matchStatus === 'PLAYING' || matchStatus === 'FINISHED') && (
            <View style={styles.simulationContainer}>
              <View style={styles.scoreboard}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreTeamName}>TU QUINTETO</Text>
                  <Text style={styles.scoreNumber}>{myScore}</Text>
                </View>

                <View style={styles.scoreDivider}>
                  <Text style={styles.finalLabel}>
                    {matchStatus === 'PLAYING' ? 'EN VIVO' : 'FINAL'}
                  </Text>
                </View>

                <View style={styles.scoreBox}>
                  <Text style={styles.scoreTeamName}>{selectedOpponent.name}</Text>
                  <Text style={styles.scoreNumber}>{oppScore}</Text>
                </View>
              </View>

              <View style={styles.logsBox}>
                {quarterLogs.map((log, index) => (
                  <View key={index} style={styles.logRow}>
                    <Ionicon name="sparkles" size={13} color="#0284C7" />
                    <Text style={styles.logText}>
                      {log}
                    </Text>
                  </View>
                ))}
              </View>

              {matchStatus === 'FINISHED' && (
                <View style={styles.finishedActions}>
                  <Text
                    style={[
                      styles.resultAnnouncement,
                      { color: myScore > oppScore ? '#16A34A' : '#CA8A04' },
                    ]}
                  >
                    {myScore > oppScore ? '¡VICTORIA!' : '¡PARTIDO FINALIZADO!'}
                  </Text>
                  <Text style={styles.coinsWonText}>
                    +{myScore > oppScore ? 350 : 120} Monedas obtenidas
                  </Text>

                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.collectBtn}
                  >
                    <Text style={styles.collectBtnText}>CONTINUAR</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  matchupBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  teamBox: {
    alignItems: 'center',
    flex: 1,
  },
  teamLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 2,
  },
  teamOvr: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  oppOvr: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#475569',
  },
  teamChem: {
    fontSize: 10,
    color: '#94A3B8',
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
    paddingHorizontal: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  opponentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  oppPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  oppPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  oppPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
  },
  oppPillTextActive: {
    color: '#FFFFFF',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    padding: 10,
    borderRadius: 6,
    gap: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CA8A04',
  },
  rewardText: {
    fontSize: 11,
    color: '#854D0E',
  },
  rewardBold: {
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  simulationContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  scoreBox: {
    alignItems: 'center',
    flex: 1,
  },
  scoreTeamName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 2,
  },
  scoreNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  scoreDivider: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  finalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  logsBox: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 10,
    gap: 4,
    marginBottom: 14,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  logText: {
    fontSize: 11,
    color: '#334155',
    flex: 1,
  },
  finishedActions: {
    alignItems: 'center',
    width: '100%',
  },
  resultAnnouncement: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  coinsWonText: {
    fontSize: 12,
    color: '#CA8A04',
    fontWeight: 'bold',
    marginBottom: 14,
  },
  collectBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  collectBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
