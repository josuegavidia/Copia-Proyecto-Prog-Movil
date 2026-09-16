import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SquadLineup, SeasonProgress, TeamStanding, Conference, LeagueDifficulty, NBAPlayer, ClassicTeam } from '../types';
import { NBA_TEAMS } from '../data/nbaTeams';
import { ACTIVE_NBA_PLAYERS } from '../data/nbaPlayers';
import { CLASSIC_TEAMS } from '../data/classicTeams';
import { StorageService } from '../services/storage';
import { SoundService } from '../services/sound';
import { HapticsService } from '../services/haptics';
import { calculateSquadSynergy } from '../services/chemistry';
import { Ionicon } from '../components/Common/Ionicon';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { recordSeasonWon, earnCoins } from '../store/slices/squadSlice';
import { ThreePointContestScreen } from './ThreePointContestScreen';

interface GamesScreenProps {
  lineup?: SquadLineup;
  onCoinsEarned?: (coins: number) => void;
}

type ModeTab = 'SEASON' | 'QUICK' | 'TRIPLES';
type QuickMatchCategory = 'FRANCHISES' | 'LEGENDS';

interface QuarterLogItem {
  quarter: number;
  myQ: number;
  oppQ: number;
  oppName: string;
  icon: string;
  note: string;
}

// Helper to compute realistic OVR & list of 5 players for a franchise unit (Starters vs Bench)
export const getFranchiseUnitInfo = (
  teamAbbr: string,
  difficulty: LeagueDifficulty = 'HARD'
): { ovr: number; label: string; players: NBAPlayer[] } => {
  const franchisePlayers = ACTIVE_NBA_PLAYERS.filter((p) => p.teamAbbr === teamAbbr);
  const targetUnit = difficulty === 'HARD' ? 'STARTER' : 'BENCH';
  const unitPlayers = franchisePlayers.filter((p) => p.unitType === targetUnit);
  const playersToUse = unitPlayers.length > 0 ? unitPlayers.slice(0, 5) : franchisePlayers.slice(0, 5);
  
  const avgOvr = playersToUse.length > 0
    ? Math.round(playersToUse.reduce((acc, p) => acc + p.stats.ovr, 0) / playersToUse.length)
    : 85;

  return {
    ovr: avgOvr,
    label: difficulty === 'HARD' ? 'Quinteto Titular (Difícil)' : 'Quinteto Suplente (Medio)',
    players: playersToUse,
  };
};

interface SeasonRewardInfo {
  coins: number;
  title: string;
  badge: string;
  color: string;
  icon: string;
  description: string;
}

export const getSeasonRewardTier = (rank: number): SeasonRewardInfo => {
  if (rank === 1) {
    return {
      coins: 3000,
      title: '¡CAMPEÓN ABSOLUTO DE LA NBA!',
      badge: '1º LUGAR · CAMPEÓN',
      color: '#F59E0B',
      icon: 'trophy',
      description: '¡Dominaste la liga regular terminando en lo más alto de la tabla general!',
    };
  }
  if (rank <= 3) {
    return {
      coins: 2000,
      title: '¡PODIO DE HONOR NBA!',
      badge: `${rank}º LUGAR · PODIO`,
      color: '#94A3B8',
      icon: 'medal',
      description: '¡Excelente temporada terminando entre los 3 mejores equipos de la NBA!',
    };
  }
  if (rank <= 8) {
    return {
      coins: 1200,
      title: '¡CLASIFICACIÓN DIRECTA A PLAYOFFS!',
      badge: `${rank}º LUGAR · PLAYOFFS`,
      color: '#0284C7',
      icon: 'shield-checkmark',
      description: '¡Gran rendimiento asegurando un puesto directo en la postemporada!',
    };
  }
  if (rank <= 16) {
    return {
      coins: 700,
      title: '¡ZONA DE PLAY-IN!',
      badge: `${rank}º LUGAR · PLAY-IN`,
      color: '#D97706',
      icon: 'flash',
      description: '¡Temporada competitiva en la zona de clasificación de Play-In!',
    };
  }
  return {
    coins: 350,
    title: '¡TEMPORADA COMPLETADA!',
    badge: `${rank}º LUGAR`,
    color: '#64748B',
    icon: 'ribbon',
    description: '¡Completaste las 30 jornadas oficiales de la temporada regular!',
  };
};

export const GamesScreen: React.FC<GamesScreenProps> = ({
  lineup: propsLineup,
  onCoinsEarned,
}) => {
  const dispatch = useAppDispatch();
  const reduxLineup = useAppSelector((state) => state.squad.lineup);
  const lineup = propsLineup || reduxLineup;

  const handleCoinsEarned = (coins: number) => {
    if (onCoinsEarned) {
      onCoinsEarned(coins);
    } else {
      dispatch(earnCoins(coins));
    }
  };

  const [currentMode, setCurrentMode] = useState<ModeTab>('SEASON');
  const [season, setSeason] = useState<SeasonProgress | null>(null);
  const [leagueDifficulty, setLeagueDifficulty] = useState<LeagueDifficulty>('HARD');
  const [teamName, setTeamName] = useState<string>('Tu Quinteto');
  const [teamLogo, setTeamLogo] = useState<string>('https://a.espncdn.com/i/teamlogos/nba/500/lal.png');
  const [standingsConf, setStandingsConf] = useState<Conference | 'ALL'>('ALL');
  
  // Quick Match State
  const [quickCategory, setQuickCategory] = useState<QuickMatchCategory>('FRANCHISES');
  const teamsArray = Object.values(NBA_TEAMS);
  const [selectedOpponentAbbr, setSelectedOpponentAbbr] = useState<string>('NYK');
  const [selectedClassicTeamId, setSelectedClassicTeamId] = useState<string>(CLASSIC_TEAMS[0].id);
  const [quickDifficulty, setQuickDifficulty] = useState<LeagueDifficulty>('HARD');
  
  // Match simulation modal state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simOpponentName, setSimOpponentName] = useState('');
  const [simOpponentLogo, setSimOpponentLogo] = useState('');
  const [simOpponentOvr, setSimOpponentOvr] = useState(85);
  const [simOpponentSubtitle, setSimOpponentSubtitle] = useState('');
  const [isSeasonMatch, setIsSeasonMatch] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [seasonEndModalVisible, setSeasonEndModalVisible] = useState(false);
  const [seasonEndData, setSeasonEndData] = useState<{
    rank: number;
    reward: SeasonRewardInfo;
    seasonNumber: number;
    wins: number;
    losses: number;
  } | null>(null);

  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [quarterLogs, setQuarterLogs] = useState<QuarterLogItem[]>([]);
  const [matchDone, setMatchDone] = useState(false);

  const synergy = calculateSquadSynergy(lineup);
  const cards = useAppSelector((state) => state.squad.cards);
  const [threePointModalVisible, setThreePointModalVisible] = useState(false);
  const [contestRecord, setContestRecord] = useState<{ score: number; shooterName: string }>({
    score: 0,
    shooterName: 'Ninguno',
  });

  useEffect(() => {
    const loadSeason = async () => {
      const savedName = await StorageService.getTeamName();
      const savedLogo = await StorageService.getTeamLogo();
      setTeamName(savedName);
      setTeamLogo(savedLogo);

      const loadedRecord = await StorageService.getThreePointHighScore();
      setContestRecord(loadedRecord);

      const loaded = await StorageService.getSeason();
      if (loaded) {
        setSeason(loaded);
        if (loaded.difficulty) {
          setLeagueDifficulty(loaded.difficulty);
        }
      }

      if (loaded && loaded.isCompleted && !loaded.rewardClaimed) {
        const sorted = sortStandingsList(loaded.standings, 'ALL');
        const rank = sorted.findIndex((t) => t.isUserTeam) + 1 || 1;
        const userTeam = loaded.standings.find((t) => t.isUserTeam);
        setSeasonEndData({
          rank,
          reward: getSeasonRewardTier(rank),
          seasonNumber: loaded.seasonNumber || 1,
          wins: userTeam?.wins || 0,
          losses: userTeam?.losses || 0,
        });
      }
    };
    loadSeason();
  }, []);

  const handleChangeLeagueDifficulty = async (diff: LeagueDifficulty) => {
    await HapticsService.selectionTick();
    setLeagueDifficulty(diff);
    if (season) {
      const updated = { ...season, difficulty: diff };
      await StorageService.saveSeason(updated);
      setSeason(updated);
    }
  };

  // Sort Standings Helper
  const sortStandingsList = (standings: TeamStanding[], conf: Conference | 'ALL') => {
    let list = [...standings];
    if (conf !== 'ALL') {
      list = list.filter((t) => t.isUserTeam || t.conference === conf);
    }
    list.sort((a, b) => {
      const aTotal = a.wins + a.losses;
      const bTotal = b.wins + b.losses;
      const aPct = aTotal > 0 ? a.wins / aTotal : 0;
      const bPct = bTotal > 0 ? b.wins / bTotal : 0;
      if (bPct !== aPct) return bPct - aPct;
      return b.wins - a.wins;
    });
    return list;
  };

  // Start Simulation
  const handleStartSimulation = async (
    oppName: string,
    oppLogo: string,
    oppOvr: number,
    oppSubtitle: string,
    isSeason: boolean
  ) => {
    setSimOpponentName(oppName);
    setSimOpponentLogo(oppLogo);
    setSimOpponentOvr(oppOvr);
    setSimOpponentSubtitle(oppSubtitle);
    setIsSeasonMatch(isSeason);

    setMyScore(0);
    setOppScore(0);
    setQuarterLogs([]);
    setMatchDone(false);
    setIsSimulating(true);

    let curMy = 0;
    let curOpp = 0;
    const logs: QuarterLogItem[] = [];

    // Realistic effective ratings calculation
    const userOvr = synergy.totalOvr;
    const chemBonus = ((synergy.teamChemistry - 80) / 20) * 1.0;
    const coachBonus = (((lineup.coach?.boostOffense || 0) + (lineup.coach?.boostDefense || 0)) / 8) * 0.8;
    const userPower = userOvr + chemBonus + coachBonus;

    const oppPower = oppOvr + 0.2;
    const diff = userPower - oppPower;

    const quarterHighlights = [
      { icon: 'flash', note: 'Inicio intenso con posesiones disputadas' },
      { icon: 'sparkles', note: 'Ajuste táctico y tiros desde el perímetro' },
      { icon: 'shield-checkmark', note: 'Presión defensiva y control del rebote' },
      { icon: 'flame', note: 'Cierre electrizante en los minutos finales' },
    ];

    for (let q = 1; q <= 4; q++) {
      await new Promise((r) => setTimeout(r, 600));
      await HapticsService.selectionTick();

      const baseMy = Math.floor(Math.random() * 6) + 24;
      const baseOpp = Math.floor(Math.random() * 6) + 24;

      const qMyAdvantage = Math.round(diff * 0.45);
      const randomSwing = Math.floor(Math.random() * 5) - 2;

      let qMy = baseMy + qMyAdvantage + randomSwing;
      let qOpp = baseOpp - qMyAdvantage - randomSwing;

      qMy = Math.max(18, Math.min(38, qMy));
      qOpp = Math.max(18, Math.min(38, qOpp));

      curMy += qMy;
      curOpp += qOpp;
      setMyScore(curMy);
      setOppScore(curOpp);

      const highlight = quarterHighlights[q - 1] || { icon: 'sparkles', note: 'Posesiones disputadas' };
      logs.push({
        quarter: q,
        myQ: qMy,
        oppQ: qOpp,
        oppName,
        icon: highlight.icon,
        note: highlight.note,
      });
      setQuarterLogs([...logs]);
    }

    // Overtime if tied
    if (curMy === curOpp) {
      if (diff >= 0) {
        if (Math.random() < 0.5 + diff * 0.05) {
          curMy += 4;
          curOpp += 2;
        } else {
          curMy += 2;
          curOpp += 4;
        }
      } else {
        if (Math.random() < 0.5 + Math.abs(diff) * 0.05) {
          curOpp += 4;
          curMy += 2;
        } else {
          curOpp += 2;
          curMy += 4;
        }
      }
      setMyScore(curMy);
      setOppScore(curOpp);
    }

    setMatchDone(true);
    const won = curMy > curOpp;
    const coinsWon = won ? 350 : 120;

    if (won) {
      SoundService.playVictory();
      await HapticsService.celebrate();
    } else {
      await HapticsService.packTearProgress(0.8);
    }

    handleCoinsEarned(coinsWon);

    // Update season standings if league match
    if (isSeason && season) {
      const isSeasonEnd = season.currentMatchIndex >= (season.totalMatches || 30);

      const updatedStandings = season.standings.map((team) => {
        if (team.isUserTeam) {
          return {
            ...team,
            wins: won ? team.wins + 1 : team.wins,
            losses: won ? team.losses : team.losses + 1,
            streak: won ? '1W' : '1L',
          };
        }
        if (team.teamName === oppName) {
          return {
            ...team,
            wins: won ? team.wins : team.wins + 1,
            losses: won ? team.losses + 1 : team.losses,
            streak: won ? '1L' : '1W',
          };
        }
        const oppUnit = getFranchiseUnitInfo(team.teamAbbr, leagueDifficulty);
        const winProbability = Math.max(0.25, Math.min(0.85, 0.5 + (oppUnit.ovr - 85) * 0.04));
        const teamWonRandom = Math.random() < winProbability;
        return {
          ...team,
          wins: teamWonRandom ? team.wins + 1 : team.wins,
          losses: teamWonRandom ? team.losses : team.losses + 1,
        };
      });

      const sorted = sortStandingsList(updatedStandings, 'ALL');
      const finalUserRank = sorted.findIndex((t) => t.isUserTeam) + 1 || 1;
      const userTeam = updatedStandings.find((t) => t.isUserTeam);

      const nextSeason: SeasonProgress = {
        ...season,
        difficulty: leagueDifficulty,
        currentMatchIndex: Math.min(season.totalMatches || 30, season.currentMatchIndex + (isSeasonEnd ? 0 : 1)),
        standings: updatedStandings,
        isCompleted: isSeasonEnd,
        finalRank: isSeasonEnd ? finalUserRank : undefined,
        rewardClaimed: false,
        historyLogs: [
          `Jornada ${season.currentMatchIndex}: Tu Equipo ${curMy} - ${curOpp} ${oppName} [${oppSubtitle}] (${won ? 'VICTORIA' : 'DERROTA'})`,
          ...season.historyLogs,
        ],
      };

      await StorageService.saveSeason(nextSeason);
      setSeason(nextSeason);

      if (isSeasonEnd) {
        const rewardTier = getSeasonRewardTier(finalUserRank);
        setSeasonEndData({
          rank: finalUserRank,
          reward: rewardTier,
          seasonNumber: season.seasonNumber || 1,
          wins: userTeam?.wins || 0,
          losses: userTeam?.losses || 0,
        });
      }
    }
  };

  const handleClaimSeasonReward = async () => {
    if (!season || !seasonEndData) return;

    await HapticsService.celebrate();
    SoundService.playVictory();

    // If finished rank 1 (Championship Winner), record career achievement
    if (seasonEndData.rank === 1) {
      dispatch(recordSeasonWon());
    }

    handleCoinsEarned(seasonEndData.reward.coins);

    const advanced = await StorageService.advanceToNextSeason(season);
    setSeason(advanced);
    setSeasonEndModalVisible(false);
    setSeasonEndData(null);
  };

  const handleResetSeason = async () => {
    Alert.alert(
      'Reiniciar Temporada',
      '¿Deseas reiniciar la temporada regular y la tabla de posiciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            await HapticsService.selectionTick();
            const reseted = await StorageService.resetSeason();
            setSeason(reseted);
          },
        },
      ]
    );
  };

  const getSortedStandings = () => {
    if (!season) return [];
    return sortStandingsList(season.standings, standingsConf);
  };

  // Next Season Opponent calculations
  const getNextSeasonOpponent = () => {
    const oppAbbrs = Object.keys(NBA_TEAMS);
    const index = ((season?.currentMatchIndex || 1) - 1) % oppAbbrs.length;
    const abbr = oppAbbrs[index];
    return NBA_TEAMS[abbr] || NBA_TEAMS.BOS;
  };

  const nextSeasonOpponent = getNextSeasonOpponent();
  const nextSeasonUnitInfo = getFranchiseUnitInfo(nextSeasonOpponent.abbreviation, leagueDifficulty);

  // Quick Match Opponents
  const selectedFranchise = NBA_TEAMS[selectedOpponentAbbr] || NBA_TEAMS.NYK;
  const quickFranchiseUnit = getFranchiseUnitInfo(selectedFranchise.abbreviation, quickDifficulty);
  const selectedClassicTeam = CLASSIC_TEAMS.find((t) => t.id === selectedClassicTeamId) || CLASSIC_TEAMS[0];

  return (
    <View style={styles.container}>
      {/* Top Mode Selector Tabs & Info Button */}
      <View style={styles.topTabs}>
        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setCurrentMode('SEASON');
          }}
          style={[styles.topTab, currentMode === 'SEASON' && styles.topTabActive]}
        >
          <Ionicons name="trophy" size={15} color={currentMode === 'SEASON' ? '#FFFFFF' : '#64748B'} style={{ marginRight: 6 }} />
          <Text
            style={[
              styles.topTabText,
              currentMode === 'SEASON' && styles.topTabTextActive,
            ]}
          >
            Temporada NBA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setCurrentMode('QUICK');
          }}
          style={[styles.topTab, currentMode === 'QUICK' && styles.topTabActive]}
        >
          <Ionicons name="flash" size={15} color={currentMode === 'QUICK' ? '#FFFFFF' : '#64748B'} style={{ marginRight: 5 }} />
          <Text
            style={[
              styles.topTabText,
              currentMode === 'QUICK' && styles.topTabTextActive,
            ]}
          >
            Práctica
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setCurrentMode('TRIPLES');
          }}
          style={[styles.topTab, currentMode === 'TRIPLES' && styles.topTabActiveTriples]}
        >
          <Ionicons name="flame" size={15} color={currentMode === 'TRIPLES' ? '#FFFFFF' : '#DC2626'} style={{ marginRight: 5 }} />
          <Text
            style={[
              styles.topTabText,
              currentMode === 'TRIPLES' && styles.topTabTextActive,
            ]}
          >
            Triples 3PT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setInfoModalVisible(true);
          }}
          style={styles.infoTopBtn}
        >
          <Ionicons name="information-circle-outline" size={15} color="#006BB6" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* MODE 1: TEMPORADA REGULAR NBA */}
        {currentMode === 'SEASON' && season && (
          <View>
            {/* Season Fixture Card */}
            <View style={styles.fixtureCard}>
              <View style={styles.fixtureHeader}>
                <View style={styles.fixtureHeaderLeft}>
                  <Ionicons name="trophy" size={16} color="#CA8A04" style={{ marginRight: 6 }} />
                  <Text style={styles.fixtureTitle}>
                    {season.isCompleted
                      ? `TEMPORADA NBA #${season.seasonNumber} · COMPLETADA`
                      : `TEMPORADA NBA #${season.seasonNumber} · JORNADA ${season.currentMatchIndex} DE 30`}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleResetSeason}
                  style={styles.resetBtn}
                >
                  <Ionicons name="refresh" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Dificultad Selector: Titulares (Difícil) vs Suplentes (Medio) */}
              <View style={styles.difficultyPickerBox}>
                <Text style={styles.difficultyPickerLabel}>NIVEL DE DIFICULTAD DE LA LIGA:</Text>
                <View style={styles.difficultyButtonsRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleChangeLeagueDifficulty('HARD')}
                    style={[
                      styles.diffPill,
                      leagueDifficulty === 'HARD' && styles.diffPillActiveHard,
                    ]}
                  >
                    <Ionicons name="flame" size={13} color={leagueDifficulty === 'HARD' ? '#FFFFFF' : '#EF4444'} style={{ marginRight: 4 }} />
                    <Text
                      style={[
                        styles.diffPillText,
                        leagueDifficulty === 'HARD' && styles.diffPillTextActive,
                      ]}
                    >
                      Titulares · Difícil
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleChangeLeagueDifficulty('MEDIUM')}
                    style={[
                      styles.diffPill,
                      leagueDifficulty === 'MEDIUM' && styles.diffPillActiveMedium,
                    ]}
                  >
                    <Ionicons name="flash" size={13} color={leagueDifficulty === 'MEDIUM' ? '#FFFFFF' : '#0284C7'} style={{ marginRight: 4 }} />
                    <Text
                      style={[
                        styles.diffPillText,
                        leagueDifficulty === 'MEDIUM' && styles.diffPillTextActive,
                      ]}
                    >
                      Suplentes · Medio
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {season.isCompleted ? (
                <View style={styles.seasonCompletedCard}>
                  <View style={styles.seasonCompletedIconWrap}>
                    <Ionicon name="trophy" size={28} color="#F59E0B" />
                  </View>
                  <Text style={styles.seasonCompletedTitle}>
                    ¡TEMPORADA #{season.seasonNumber} COMPLETADA!
                  </Text>
                  <Text style={styles.seasonCompletedSub}>
                    Has jugado los 30 partidos oficiales de la temporada regular contra todas las franquicias.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.matchupRow}>
                    <View style={styles.teamBox}>
                      <Image
                        source={{ uri: teamLogo }}
                        style={styles.rivalLogo}
                        resizeMode="contain"
                      />
                      <Text numberOfLines={1} style={styles.teamBoxLabel}>{teamName.toUpperCase()}</Text>
                      <Text style={styles.teamBoxOvr}>{synergy.totalOvr} OVR</Text>
                      <Text style={styles.teamBoxChem}>Química: {synergy.teamChemistry}%</Text>
                    </View>

                    <Text style={styles.vsBadge}>VS</Text>

                    <View style={styles.teamBox}>
                      <Image
                        source={{ uri: nextSeasonOpponent.logoUrl }}
                        style={styles.rivalLogo}
                        resizeMode="contain"
                      />
                      <Text numberOfLines={1} style={styles.teamBoxName}>
                        {nextSeasonOpponent.name}
                      </Text>
                      <Text style={[styles.teamBoxOvr, { color: leagueDifficulty === 'HARD' ? '#EF4444' : '#0284C7' }]}>
                        {nextSeasonUnitInfo.ovr} OVR
                      </Text>
                      <Text style={styles.unitTagSmall}>{nextSeasonUnitInfo.label}</Text>
                    </View>
                  </View>

                  {/* Rival Unit Player Lineup Preview */}
                  <View style={styles.lineupPreviewBar}>
                    <Text style={styles.lineupPreviewTitle}>
                      {leagueDifficulty === 'HARD' ? '⭐ 5 TITULARES RIVALES:' : '⚡ 5 SUPLENTES RIVALES:'}
                    </Text>
                    <Text numberOfLines={1} style={styles.lineupPreviewPlayers}>
                      {nextSeasonUnitInfo.players.map((p) => `${p.name} (${p.stats.ovr})`).join(' · ')}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                      handleStartSimulation(
                        nextSeasonOpponent.name,
                        nextSeasonOpponent.logoUrl,
                        nextSeasonUnitInfo.ovr,
                        nextSeasonUnitInfo.label,
                        true
                      )
                    }
                    style={styles.playSeasonBtn}
                  >
                    <Ionicons name="play" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.playSeasonBtnText}>
                      ¡JUGAR JORNADA {season.currentMatchIndex} DE 30!
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Standings Filter */}
            <View style={styles.standingsHeaderRow}>
              <Text style={styles.standingsTitle}>TABLA DE POSICIONES OFICIAL</Text>
              <View style={styles.confFilterPills}>
                {(['ALL', 'Eastern', 'Western'] as const).map((conf) => (
                  <TouchableOpacity
                    key={conf}
                    onPress={() => {
                      HapticsService.selectionTick();
                      setStandingsConf(conf);
                    }}
                    style={[
                      styles.confPill,
                      standingsConf === conf && styles.confPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.confPillText,
                        standingsConf === conf && styles.confPillTextActive,
                      ]}
                    >
                      {conf === 'ALL' ? 'Liga' : conf === 'Eastern' ? 'Este' : 'Oeste'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Official NBA Standings Table */}
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.thText, { width: 28 }]}>#</Text>
                <Text style={[styles.thText, { flex: 1 }]}>EQUIPO</Text>
                <Text style={[styles.thText, { width: 34, textAlign: 'center' }]}>V</Text>
                <Text style={[styles.thText, { width: 34, textAlign: 'center' }]}>D</Text>
                <Text style={[styles.thText, { width: 48, textAlign: 'center' }]}>%V</Text>
              </View>

              {getSortedStandings().map((row, idx) => {
                const totalGames = row.wins + row.losses;
                const winPct = totalGames > 0 ? (row.wins / totalGames).toFixed(3).replace('0.', '.') : '.000';

                return (
                  <View
                    key={row.isUserTeam ? `user_${row.teamAbbr}` : `team_${row.teamAbbr}`}
                    style={[
                      styles.tableRow,
                      row.isUserTeam && styles.tableRowUser,
                      idx === 7 && styles.playoffCutoffRow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankText,
                        row.isUserTeam && styles.userHighlightText,
                      ]}
                    >
                      {idx + 1}
                    </Text>

                    <View style={styles.teamCell}>
                      {row.logoUrl ? (
                        <Image
                          source={{ uri: row.logoUrl }}
                          style={styles.tableTeamLogo}
                          resizeMode="contain"
                        />
                      ) : null}
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.tableTeamName,
                          row.isUserTeam && styles.userHighlightText,
                        ]}
                      >
                        {row.teamName}
                      </Text>
                    </View>

                    <Text style={styles.statCell}>{row.wins}</Text>
                    <Text style={styles.statCell}>{row.losses}</Text>
                    <Text style={styles.pctCell}>{winPct}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* MODE 2: PRÁCTICA & QUINTETOS HISTÓRICOS */}
        {currentMode === 'QUICK' && (
          <View>
            {/* Quick Match Sub-Tabs */}
            <View style={styles.quickSubTabs}>
              <TouchableOpacity
                onPress={() => {
                  HapticsService.selectionTick();
                  setQuickCategory('FRANCHISES');
                }}
                style={[
                  styles.quickSubTab,
                  quickCategory === 'FRANCHISES' && styles.quickSubTabActive,
                ]}
              >
                <Ionicons name="shield" size={14} color={quickCategory === 'FRANCHISES' ? '#FFFFFF' : '#64748B'} style={{ marginRight: 6 }} />
                <Text
                  style={[
                    styles.quickSubTabText,
                    quickCategory === 'FRANCHISES' && styles.quickSubTabTextActive,
                  ]}
                >
                  Franquicias 2026-27
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  HapticsService.selectionTick();
                  setQuickCategory('LEGENDS');
                }}
                style={[
                  styles.quickSubTab,
                  quickCategory === 'LEGENDS' && styles.quickSubTabActiveLegend,
                ]}
              >
                <Ionicons name="sparkles" size={14} color={quickCategory === 'LEGENDS' ? '#713F12' : '#B45309'} style={{ marginRight: 6 }} />
                <Text
                  style={[
                    styles.quickSubTabText,
                    quickCategory === 'LEGENDS' && styles.quickSubTabTextActiveLegend,
                  ]}
                >
                  Quintetos Míticos NBA 2K
                </Text>
              </TouchableOpacity>
            </View>

            {/* Selected Rival Hero Card */}
            <View style={styles.quickMatchCard}>
              <View style={styles.matchupBanner}>
                <View style={styles.teamHeroBox}>
                  <Text numberOfLines={1} style={styles.teamHeroLabel}>{teamName.toUpperCase()}</Text>
                  <Text style={styles.teamHeroOvr}>{synergy.totalOvr} OVR</Text>
                  <Text style={styles.teamHeroChem}>Química {synergy.teamChemistry}%</Text>
                </View>

                <Text style={styles.vsBadgeLarge}>VS</Text>

                <View style={styles.teamHeroBox}>
                  <Image
                    source={{ uri: quickCategory === 'FRANCHISES' ? selectedFranchise.logoUrl : selectedClassicTeam.logoUrl }}
                    style={styles.heroRivalLogo}
                    resizeMode="contain"
                  />
                  <Text numberOfLines={1} style={styles.teamHeroName}>
                    {quickCategory === 'FRANCHISES' ? selectedFranchise.name : selectedClassicTeam.name}
                  </Text>
                  <Text style={[styles.teamHeroOvr, { color: quickCategory === 'LEGENDS' ? '#CA8A04' : '#0F172A' }]}>
                    {quickCategory === 'FRANCHISES' ? quickFranchiseUnit.ovr : selectedClassicTeam.ovr} OVR
                  </Text>
                </View>
              </View>

              {/* If Franchise mode, allow choosing Starters vs Bench */}
              {quickCategory === 'FRANCHISES' && (
                <View style={styles.quickUnitToggleRow}>
                  <TouchableOpacity
                    onPress={() => {
                      HapticsService.selectionTick();
                      setQuickDifficulty('HARD');
                    }}
                    style={[
                      styles.quickUnitPill,
                      quickDifficulty === 'HARD' && styles.quickUnitPillActiveHard,
                    ]}
                  >
                    <Text style={[styles.quickUnitText, quickDifficulty === 'HARD' && styles.quickUnitTextActive]}>
                      Titulares (Difícil)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      HapticsService.selectionTick();
                      setQuickDifficulty('MEDIUM');
                    }}
                    style={[
                      styles.quickUnitPill,
                      quickDifficulty === 'MEDIUM' && styles.quickUnitPillActiveMed,
                    ]}
                  >
                    <Text style={[styles.quickUnitText, quickDifficulty === 'MEDIUM' && styles.quickUnitTextActive]}>
                      Suplentes (Medio)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Starters Preview */}
              <View style={styles.quickStartersRow}>
                <Text style={styles.quickStartersLabel}>
                  {quickCategory === 'LEGENDS' ? 'QUINTETO TITULAR HISTÓRICO:' : `5 ${quickDifficulty === 'HARD' ? 'TITULARES' : 'SUPLENTES'}:`}
                </Text>
                <Text numberOfLines={2} style={styles.quickStartersText}>
                  {quickCategory === 'LEGENDS'
                    ? selectedClassicTeam.starters.map((p) => `${p.name} (${p.stats.ovr})`).join(' · ')
                    : quickFranchiseUnit.players.map((p) => `${p.name} (${p.stats.ovr})`).join(' · ')}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  handleStartSimulation(
                    quickCategory === 'FRANCHISES' ? selectedFranchise.name : selectedClassicTeam.name,
                    quickCategory === 'FRANCHISES' ? selectedFranchise.logoUrl : selectedClassicTeam.logoUrl,
                    quickCategory === 'FRANCHISES' ? quickFranchiseUnit.ovr : selectedClassicTeam.ovr,
                    quickCategory === 'FRANCHISES' ? quickFranchiseUnit.label : `Equipo Legendario ${selectedClassicTeam.year}`,
                    false
                  )
                }
                style={[
                  styles.startQuickMatchBtn,
                  quickCategory === 'LEGENDS' && styles.startQuickMatchBtnLegend,
                ]}
              >
                <Ionicons name="play" size={16} color={quickCategory === 'LEGENDS' ? '#713F12' : '#FFFFFF'} style={{ marginRight: 6 }} />
                <Text
                  style={[
                    styles.startQuickMatchBtnText,
                    quickCategory === 'LEGENDS' && { color: '#713F12' },
                  ]}
                >
                  {quickCategory === 'LEGENDS' ? '¡DESAFIAR QUINTETO MÍTICO!' : '¡SIMULAR PARTIDO DE PRÁCTICA!'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* List Selection for FRANCHISES */}
            {quickCategory === 'FRANCHISES' && (
              <View>
                <Text style={styles.allTeamsHeading}>TODAS LAS FRANQUICIAS NBA (2026-27)</Text>
                <View style={styles.teamsGrid}>
                  {teamsArray.map((team) => {
                    const isSelected = selectedOpponentAbbr === team.abbreviation;
                    const unit = getFranchiseUnitInfo(team.abbreviation, quickDifficulty);

                    return (
                      <TouchableOpacity
                        key={team.abbreviation}
                        onPress={() => {
                          HapticsService.selectionTick();
                          setSelectedOpponentAbbr(team.abbreviation);
                        }}
                        style={[
                          styles.teamGridCard,
                          isSelected && styles.teamGridCardActive,
                        ]}
                      >
                        <Image
                          source={{ uri: team.logoUrl }}
                          style={styles.teamGridLogo}
                          resizeMode="contain"
                        />
                        <Text numberOfLines={1} style={styles.teamGridName}>
                          {team.name}
                        </Text>
                        <Text style={styles.teamGridOvr}>{unit.ovr} OVR</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* List Selection for LEGEND CLASSIC TEAMS */}
            {quickCategory === 'LEGENDS' && (
              <View>
                <Text style={styles.allTeamsHeading}>QUINTETOS HISTÓRICOS & LEYENDAS NBA 2K</Text>
                <View style={styles.classicTeamsGrid}>
                  {CLASSIC_TEAMS.map((ct) => {
                    const isSelected = selectedClassicTeamId === ct.id;

                    return (
                      <TouchableOpacity
                        key={ct.id}
                        activeOpacity={0.85}
                        onPress={() => {
                          HapticsService.selectionTick();
                          setSelectedClassicTeamId(ct.id);
                        }}
                        style={[
                          styles.classicTeamCard,
                          isSelected && styles.classicTeamCardActive,
                        ]}
                      >
                        <View style={styles.classicCardTop}>
                          <Image
                            source={{ uri: ct.logoUrl }}
                            style={styles.classicTeamLogo}
                            resizeMode="contain"
                          />
                          <View style={styles.classicMeta}>
                            <Text numberOfLines={1} style={styles.classicTeamName}>
                              {ct.name}
                            </Text>
                            <Text style={styles.classicTeamYear}>
                              Año: {ct.year} · {ct.franchise}
                            </Text>
                          </View>
                          <View style={styles.classicOvrBadge}>
                            <Text style={styles.classicOvrVal}>{ct.ovr}</Text>
                            <Text style={styles.classicOvrSub}>OVR</Text>
                          </View>
                        </View>

                        <Text numberOfLines={2} style={styles.classicDesc}>
                          {ct.description}
                        </Text>

                        <View style={styles.classicStartersPills}>
                          {ct.starters.map((s, idx) => (
                            <View key={idx} style={styles.classicStarterChip}>
                              <Text numberOfLines={1} style={styles.classicStarterChipText}>
                                {s.name.split(' ').pop()} {s.stats.ovr}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        {/* MODE 3: CONCURSO DE TRIPLES ALL-STAR */}
        {currentMode === 'TRIPLES' && (
          <View style={styles.triplesHubCard}>
            <View style={styles.triplesHubHeader}>
              <View style={styles.triplesBadge}>
                <Ionicons name="flame" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                <Text style={styles.triplesBadgeText}>MINIJUEGO ALL-STAR OFICIAL</Text>
              </View>
              <Text style={styles.triplesHubTitle}>Torneo de Triples 3PT Contest</Text>
              <Text style={styles.triplesHubDesc}>
                Pon a prueba la puntería de tus mejores francotiradores. Los tiradores se filtran y ordenan automáticamente de mayor a menor según su estadística de Triples (3PT).
              </Text>
            </View>

            {/* High score badge & specs */}
            <View style={styles.triplesStatsBox}>
              <View style={styles.triplesStatItem}>
                <Ionicons name="trophy" size={26} color="#F59E0B" />
                <Text style={styles.triplesStatLabel}>RÉCORD ACTUAL</Text>
                <Text style={styles.triplesStatVal}>{contestRecord.score} PTS</Text>
                <Text numberOfLines={1} style={styles.triplesStatSub}>
                  {contestRecord.shooterName}
                </Text>
              </View>

              <View style={styles.triplesStatDivider} />

              <View style={styles.triplesStatItem}>
                <Ionicons name="basketball" size={26} color="#EA580C" />
                <Text style={styles.triplesStatLabel}>ESTRUCTURA</Text>
                <Text style={styles.triplesStatVal}>5 RACKS</Text>
                <Text style={styles.triplesStatSub}>25 Tiros · 30 Pts Max</Text>
              </View>
            </View>

            {/* Feature points */}
            <View style={styles.triplesFeaturesList}>
              <View style={styles.triplesFeatureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={styles.triplesFeatureText}>
                  <Text style={{ fontWeight: '800', color: '#0F172A' }}>Filtrado descendente:</Text> Selecciona entre tus cartas o leyendas All-Star ordenadas estrictamente por su atributo de 3PT.
                </Text>
              </View>
              <View style={styles.triplesFeatureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={styles.triplesFeatureText}>
                  <Text style={{ fontWeight: '800', color: '#0F172A' }}>Green Release:</Text> A mayor 3PT rating (ej. Curry 99, Klay 98), más amplia y generosa es la ventana verde.
                </Text>
              </View>
              <View style={styles.triplesFeatureRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={styles.triplesFeatureText}>
                  <Text style={{ fontWeight: '800', color: '#0F172A' }}>Money Balls:</Text> El último balón de cada rack otorga 2 puntos bonus.
                </Text>
              </View>
            </View>

            {/* Big Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                HapticsService.selectionTick();
                setThreePointModalVisible(true);
              }}
              style={styles.launchTriplesBtn}
            >
              <Ionicons name="play-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.launchTriplesBtnText}>PARTICIPAR EN EL CONCURSO DE TRIPLES</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* LIVE MATCH SIMULATION MODAL */}
      <Modal visible={isSimulating} transparent animationType="fade">
        <View style={styles.simModalOverlay}>
          <View style={styles.simModalBox}>
            <View style={styles.simHeader}>
              <View style={styles.simHeaderTitleWrap}>
                <Ionicons name="flash" size={18} color="#0284C7" style={{ marginRight: 6 }} />
                <Text style={styles.simHeaderTitle}>
                  {isSeasonMatch ? 'PARTIDO DE TEMPORADA' : 'PARTIDO DE EXHIBICIÓN'}
                </Text>
              </View>
              {matchDone && (
                <TouchableOpacity
                  onPress={() => setIsSimulating(false)}
                  style={styles.closeSimBtn}
                >
                  <Ionicons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>

            {/* Scoreboard */}
            <View style={styles.simScoreboard}>
              <View style={styles.simScoreTeam}>
                <Text numberOfLines={1} style={styles.simScoreTeamName}>{teamName.toUpperCase()}</Text>
                <Text style={styles.simScoreNumber}>{myScore}</Text>
              </View>

              <View style={styles.simScoreDivider}>
                <Text style={styles.simStatusText}>
                  {matchDone ? 'FINAL' : 'EN VIVO'}
                </Text>
              </View>

              <View style={styles.simScoreTeam}>
                <Text numberOfLines={1} style={styles.simScoreTeamName}>
                  {simOpponentName}
                </Text>
                <Text style={styles.simScoreNumber}>{oppScore}</Text>
              </View>
            </View>

            {/* Quarter Logs */}
            <View style={styles.simLogsContainer}>
              {quarterLogs.map((log, index) => (
                <View key={index} style={styles.simLogRow}>
                  <Ionicon name={log.icon} size={14} color="#006BB6" />
                  <Text style={styles.simLogText}>
                    Cuarto {log.quarter}: Tu Equipo {log.myQ} - {log.oppQ} {log.oppName} ({log.note})
                  </Text>
                </View>
              ))}
            </View>

            {/* Result & Continue */}
            {matchDone && (
              <View style={styles.simDoneBox}>
                <Text
                  style={[
                    styles.simResultText,
                    { color: myScore > oppScore ? '#16A34A' : '#CA8A04' },
                  ]}
                >
                  {myScore > oppScore ? '¡VICTORIA!' : '¡PARTIDO FINALIZADO!'}
                </Text>
                <Text style={styles.simCoinsReward}>
                  +{myScore > oppScore ? 350 : 120} Monedas Ganadas
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setIsSimulating(false);
                    if (isSeasonMatch && season && (season.isCompleted || (seasonEndData !== null))) {
                      setTimeout(() => setSeasonEndModalVisible(true), 350);
                    }
                  }}
                  style={styles.simContinueBtn}
                >
                  <Text style={styles.simContinueBtnText}>
                    GUARDAR Y CONTINUAR
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* SEASON END AWARDS CEREMONY MODAL */}
      <Modal visible={seasonEndModalVisible} transparent animationType="slide">
        <View style={styles.seasonEndOverlay}>
          <View style={styles.seasonEndCard}>
            {seasonEndData && (
              <>
                <View
                  style={[
                    styles.seasonEndIconCircle,
                    { backgroundColor: seasonEndData.reward.color + '18', borderColor: seasonEndData.reward.color },
                  ]}
                >
                  <Ionicon name={seasonEndData.reward.icon} size={38} color={seasonEndData.reward.color} />
                </View>

                <View
                  style={[
                    styles.seasonEndRankBadge,
                    { backgroundColor: seasonEndData.reward.color },
                  ]}
                >
                  <Text style={styles.seasonEndRankBadgeText}>
                    {seasonEndData.reward.badge}
                  </Text>
                </View>

                <Text style={styles.seasonEndMainTitle}>
                  {seasonEndData.reward.title}
                </Text>

                <Text style={styles.seasonEndDesc}>
                  {seasonEndData.reward.description}
                </Text>

                <View style={styles.seasonStatsBox}>
                  <View style={styles.seasonStatItem}>
                    <Text style={styles.seasonStatLabel}>POSICIÓN</Text>
                    <Text style={[styles.seasonStatVal, { color: seasonEndData.reward.color }]}>
                      #{seasonEndData.rank} / 31
                    </Text>
                  </View>

                  <View style={styles.seasonStatDivider} />

                  <View style={styles.seasonStatItem}>
                    <Text style={styles.seasonStatLabel}>BALANCE</Text>
                    <Text style={styles.seasonStatVal}>
                      {seasonEndData.wins}V - {seasonEndData.losses}D
                    </Text>
                  </View>

                  <View style={styles.seasonStatDivider} />

                  <View style={styles.seasonStatItem}>
                    <Text style={styles.seasonStatLabel}>TEMPORADA</Text>
                    <Text style={styles.seasonStatVal}>
                      #{seasonEndData.seasonNumber}
                    </Text>
                  </View>
                </View>

                <View style={styles.seasonRewardCoinsCard}>
                  <Text style={styles.rewardCoinsLabel}>RECOMPENSA EXTRA DE TEMPORADA</Text>
                  <View style={styles.rewardCoinsRow}>
                    <Ionicon name="sparkles" size={20} color="#F59E0B" />
                    <Text style={styles.rewardCoinsAmount}>
                      +{seasonEndData.reward.coins.toLocaleString()} MONEDAS
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleClaimSeasonReward}
                  style={[
                    styles.claimRewardBigBtn,
                    { backgroundColor: seasonEndData.reward.color },
                  ]}
                >
                  <Text style={styles.claimRewardBigBtnText}>
                    RECLAMAR PREMIOS E INICIAR SIGUIENTE TEMPORADA
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* CRITERIA / RULES MODAL */}
      <Modal visible={infoModalVisible} transparent animationType="fade">
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalCard}>
            <View style={styles.infoModalHeader}>
              <View style={styles.infoModalHeaderLeft}>
                <Ionicons name="information-circle" size={20} color="#006BB6" />
                <Text style={styles.infoModalTitle}>REGLAS Y DIFICULTAD NBA</Text>
              </View>
              <TouchableOpacity
                onPress={() => setInfoModalVisible(false)}
                style={styles.closeInfoBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.infoScroll}>
              <Text style={styles.infoIntro}>
                Ajusta la dificultad de la liga y pon a prueba a tu quinteto contra los mejores del mundo:
              </Text>

              <View style={styles.infoCardItem}>
                <View style={[styles.infoIconBox, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="flame" size={18} color="#DC2626" />
                </View>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>Titulares · Difícil</Text>
                  <Text style={styles.infoItemText}>
                    Enfrentas al Quinteto Titular de cada franquicia con sus máximas estrellas (Brunson, Tatum, Jokic, Doncic, etc.). OVRs elevados.
                  </Text>
                </View>
              </View>

              <View style={styles.infoCardItem}>
                <View style={[styles.infoIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="flash" size={18} color="#0284C7" />
                </View>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>Suplentes · Medio</Text>
                  <Text style={styles.infoItemText}>
                    Enfrentas a la Segunda Unidad (Quinteto Suplente) de cada franquicia. Dificultad equilibrada para plantillas en desarrollo.
                  </Text>
                </View>
              </View>

              <View style={styles.infoCardItem}>
                <View style={[styles.infoIconBox, { backgroundColor: '#FEF9C3' }]}>
                  <Ionicons name="sparkles" size={18} color="#CA8A04" />
                </View>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>Quintetos Míticos & Iconos</Text>
                  <Text style={styles.infoItemText}>
                    En modo Práctica puedes desafiar a los Bulls '96 de Jordan, Lakers '01 de Shaq & Kobe, Warriors '17 de Curry y más leyendas.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setInfoModalVisible(false)}
              style={styles.understoodBtn}
            >
              <Text style={styles.understoodBtnText}>ENTENDIDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3-POINT ALL-STAR CONTEST MINIGAME MODAL */}
      <ThreePointContestScreen
        visible={threePointModalVisible}
        onClose={async () => {
          setThreePointModalVisible(false);
          const updatedRecord = await StorageService.getThreePointHighScore();
          setContestRecord(updatedRecord);
        }}
        inventoryCards={cards}
        onCoinsEarned={handleCoinsEarned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  topTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  topTabActive: {
    backgroundColor: '#1D428A',
  },
  topTabActiveTriples: {
    backgroundColor: '#DC2626',
  },
  topTabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  topTabTextActive: {
    color: '#FFFFFF',
  },
  triplesHubCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  triplesHubHeader: {
    marginBottom: 14,
  },
  triplesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  triplesBadgeText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  triplesHubTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  triplesHubDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  triplesStatsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  triplesStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  triplesStatLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 4,
  },
  triplesStatVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  triplesStatSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    marginTop: 1,
  },
  triplesStatDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  triplesFeaturesList: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  triplesFeatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  triplesFeatureText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  launchTriplesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  launchTriplesBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  infoTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  infoTopBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#006BB6',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  fixtureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fixtureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fixtureHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fixtureTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  resetBtn: {
    padding: 4,
  },
  difficultyPickerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  difficultyPickerLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  difficultyButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  diffPillActiveHard: {
    backgroundColor: '#DC2626',
    borderColor: '#B91C1C',
  },
  diffPillActiveMedium: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
  },
  diffPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
  },
  diffPillTextActive: {
    color: '#FFFFFF',
  },
  matchupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  teamBox: {
    flex: 1,
    alignItems: 'center',
  },
  rivalLogo: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  teamBoxLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  teamBoxName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  teamBoxOvr: {
    fontSize: 15,
    fontWeight: '900',
    color: '#006BB6',
    marginTop: 2,
  },
  teamBoxChem: {
    fontSize: 9,
    fontWeight: '600',
    color: '#10B981',
  },
  unitTagSmall: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  vsBadge: {
    fontSize: 14,
    fontWeight: '900',
    color: '#94A3B8',
    paddingHorizontal: 8,
  },
  lineupPreviewBar: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 8,
    marginBottom: 10,
  },
  lineupPreviewTitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 1,
  },
  lineupPreviewPlayers: {
    fontSize: 9.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  playSeasonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D428A',
    paddingVertical: 12,
    borderRadius: 8,
  },
  playSeasonBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  seasonCompletedCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  seasonCompletedIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  seasonCompletedTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  seasonCompletedSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  standingsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  standingsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  confFilterPills: {
    flexDirection: 'row',
    gap: 4,
  },
  confPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  confPillActive: {
    backgroundColor: '#006BB6',
  },
  confPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  confPillTextActive: {
    color: '#FFFFFF',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
    marginBottom: 4,
  },
  thText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  tableRowUser: {
    backgroundColor: '#EFF6FF',
    borderRadius: 4,
  },
  playoffCutoffRow: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#0284C7',
  },
  rankText: {
    width: 28,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
  },
  userHighlightText: {
    color: '#0284C7',
    fontWeight: '900',
  },
  teamCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tableTeamLogo: {
    width: 18,
    height: 18,
  },
  tableTeamName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  statCell: {
    width: 34,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  pctCell: {
    width: 48,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
  },

  // Quick Match Styles
  quickSubTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickSubTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickSubTabActive: {
    backgroundColor: '#1D428A',
    borderColor: '#1D428A',
  },
  quickSubTabActiveLegend: {
    backgroundColor: '#FEF08A',
    borderColor: '#CA8A04',
  },
  quickSubTabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
  },
  quickSubTabTextActive: {
    color: '#FFFFFF',
  },
  quickSubTabTextActiveLegend: {
    color: '#713F12',
    fontWeight: '900',
  },
  quickMatchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matchupBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamHeroBox: {
    flex: 1,
    alignItems: 'center',
  },
  teamHeroLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  heroRivalLogo: {
    width: 44,
    height: 44,
    marginBottom: 4,
  },
  teamHeroName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  teamHeroOvr: {
    fontSize: 16,
    fontWeight: '900',
    color: '#006BB6',
    marginTop: 2,
  },
  teamHeroChem: {
    fontSize: 9,
    fontWeight: '600',
    color: '#10B981',
  },
  vsBadgeLarge: {
    fontSize: 16,
    fontWeight: '900',
    color: '#94A3B8',
    paddingHorizontal: 8,
  },
  quickUnitToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  quickUnitPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickUnitPillActiveHard: {
    backgroundColor: '#DC2626',
    borderColor: '#B91C1C',
  },
  quickUnitPillActiveMed: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
  },
  quickUnitText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  quickUnitTextActive: {
    color: '#FFFFFF',
  },
  quickStartersRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickStartersLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 2,
  },
  quickStartersText: {
    fontSize: 10,
    color: '#0F172A',
    fontWeight: '600',
    lineHeight: 14,
  },
  startQuickMatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 8,
  },
  startQuickMatchBtnLegend: {
    backgroundColor: '#FEF08A',
    borderColor: '#CA8A04',
    borderWidth: 1.5,
  },
  startQuickMatchBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  allTeamsHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  teamGridCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teamGridCardActive: {
    borderColor: '#0284C7',
    borderWidth: 2,
    backgroundColor: '#EFF6FF',
  },
  teamGridLogo: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  teamGridName: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  teamGridOvr: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 2,
  },

  // Classic Teams Grid
  classicTeamsGrid: {
    gap: 10,
  },
  classicTeamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  classicTeamCardActive: {
    borderColor: '#CA8A04',
    borderWidth: 2,
    backgroundColor: '#FEFCE8',
  },
  classicCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  classicTeamLogo: {
    width: 38,
    height: 38,
  },
  classicMeta: {
    flex: 1,
  },
  classicTeamName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  classicTeamYear: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  classicOvrBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CA8A04',
  },
  classicOvrVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#713F12',
  },
  classicOvrSub: {
    fontSize: 7,
    fontWeight: '900',
    color: '#854D0E',
  },
  classicDesc: {
    fontSize: 10.5,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 14,
  },
  classicStartersPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  classicStarterChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  classicStarterChipText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#334155',
  },

  // Simulation Modal
  simModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  simModalBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  simHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  simHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeSimBtn: {
    padding: 4,
  },
  simScoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  simScoreTeam: {
    flex: 1,
    alignItems: 'center',
  },
  simScoreTeamName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  simScoreNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FEF08A',
  },
  simScoreDivider: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  simStatusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  simLogsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  simLogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simLogText: {
    fontSize: 10.5,
    color: '#334155',
    flex: 1,
  },
  simDoneBox: {
    alignItems: 'center',
    gap: 6,
  },
  simResultText: {
    fontSize: 15,
    fontWeight: '900',
  },
  simCoinsReward: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#CA8A04',
    marginBottom: 6,
  },
  simContinueBtn: {
    width: '100%',
    backgroundColor: '#1D428A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  simContinueBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Season End Modal
  seasonEndOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  seasonEndCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  seasonEndIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  seasonEndRankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  seasonEndRankBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  seasonEndMainTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  seasonEndDesc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  seasonStatsBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  seasonStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  seasonStatLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 2,
  },
  seasonStatVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  seasonStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  seasonRewardCoinsCard: {
    width: '100%',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardCoinsLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  rewardCoinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardCoinsAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#92400E',
  },
  claimRewardBigBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimRewardBigBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Info Modal
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  infoModalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  infoModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoModalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeInfoBtn: {
    padding: 4,
  },
  infoScroll: {
    marginBottom: 10,
  },
  infoIntro: {
    fontSize: 11.5,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 16,
  },
  infoCardItem: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItemContent: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  infoItemText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  understoodBtn: {
    backgroundColor: '#006BB6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  understoodBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
