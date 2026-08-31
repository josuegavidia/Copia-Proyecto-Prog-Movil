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
import { SquadLineup, SquadSynergy, SeasonProgress, TeamStanding, Conference } from '../types';
import { NBA_TEAMS } from '../data/nbaTeams';
import { StorageService } from '../services/storage';
import { SoundService } from '../services/sound';
import { HapticsService } from '../services/haptics';
import { calculateSquadSynergy } from '../services/chemistry';
import { Ionicon } from '../components/Common/Ionicon';
import { Ionicons } from '@expo/vector-icons';

interface GamesScreenProps {
  lineup: SquadLineup;
  onCoinsEarned: (coins: number) => void;
}

type ModeTab = 'QUICK' | 'SEASON';

interface QuarterLogItem {
  quarter: number;
  myQ: number;
  oppQ: number;
  oppName: string;
  icon: string;
  note: string;
}

const NBA_TEAM_OVR_MAP: Record<string, number> = {
  BOS: 96,
  OKC: 94,
  DAL: 94,
  DEN: 93,
  LAL: 92,
  GSW: 91,
  NYK: 91,
  MIN: 91,
  PHX: 90,
  MIL: 90,
  PHI: 89,
  CLE: 89,
  MIA: 88,
  MEM: 88,
  IND: 87,
  SAC: 87,
  NOP: 86,
  ORL: 86,
  HOU: 85,
  SAS: 85,
  ATL: 84,
  CHI: 83,
  TOR: 82,
  UTA: 81,
  CHA: 81,
  BKN: 80,
  POR: 80,
  DET: 79,
  WAS: 78,
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
  lineup,
  onCoinsEarned,
}) => {
  const [currentMode, setCurrentMode] = useState<ModeTab>('SEASON');
  const [season, setSeason] = useState<SeasonProgress | null>(null);
  const [teamName, setTeamName] = useState<string>('Tu Quinteto');
  const [teamLogo, setTeamLogo] = useState<string>('https://a.espncdn.com/i/teamlogos/nba/500/lal.png');
  const [standingsConf, setStandingsConf] = useState<Conference | 'ALL'>('ALL');
  
  // Quick Match Selected Opponent
  const teamsArray = Object.values(NBA_TEAMS);
  const [selectedOpponentAbbr, setSelectedOpponentAbbr] = useState<string>('DEN');
  
  // Match in progress modal state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simOpponentName, setSimOpponentName] = useState('');
  const [simOpponentLogo, setSimOpponentLogo] = useState('');
  const [simOpponentOvr, setSimOpponentOvr] = useState(85);
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

  useEffect(() => {
    const loadSeason = async () => {
      const savedName = await StorageService.getTeamName();
      const savedLogo = await StorageService.getTeamLogo();
      setTeamName(savedName);
      setTeamLogo(savedLogo);

      const loaded = await StorageService.getSeason();
      setSeason(loaded);

      // If season was already completed but reward uncollected
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

  const getTeamOvrEstimate = (abbr: string): number => {
    if (abbr === 'BOS') return 96;
    if (abbr === 'DEN') return 96;
    if (abbr === 'OKC') return 95;
    if (abbr === 'DAL') return 94;
    if (abbr === 'MIN') return 93;
    if (abbr === 'NYK') return 93;
    if (abbr === 'PHI') return 92;
    if (abbr === 'MIL') return 92;
    if (abbr === 'LAL') return 92;
    if (abbr === 'GSW') return 91;
    if (abbr === 'PHX') return 91;
    if (abbr === 'CLE') return 91;
    if (abbr === 'IND') return 90;
    if (abbr === 'MIA') return 89;
    if (abbr === 'ORL') return 89;
    return 85;
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

  // Start Simulation (for both Quick Match and Season)
  const handleStartSimulation = async (
    oppName: string,
    oppLogo: string,
    oppOvr: number,
    isSeason: boolean
  ) => {
    setSimOpponentName(oppName);
    setSimOpponentLogo(oppLogo);
    setSimOpponentOvr(oppOvr);
    setIsSeasonMatch(isSeason);

    setMyScore(0);
    setOppScore(0);
    setQuarterLogs([]);
    setMatchDone(false);
    setIsSimulating(true);

    let curMy = 0;
    let curOpp = 0;
    const logs: QuarterLogItem[] = [];

    // 1. Calculate realistic effective ratings
    // User Rating: OVR + Chemistry Factor (max +1.0) + Coach Boosts (max +0.8)
    const userOvr = synergy.totalOvr;
    const chemBonus = ((synergy.teamChemistry - 80) / 20) * 1.0;
    const coachBonus = (((lineup.coach?.boostOffense || 0) + (lineup.coach?.boostDefense || 0)) / 8) * 0.8;
    const userPower = userOvr + chemBonus + coachBonus;

    // Opponent Rating (NBA standard baseline)
    const oppPower = oppOvr + 0.25;

    // Net Difference in Power (e.g. 91 vs 96 -> -4.75 diff)
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

      // NBA realistic quarter base points (24 to 29 pts)
      const baseMy = Math.floor(Math.random() * 6) + 24;
      const baseOpp = Math.floor(Math.random() * 6) + 24;

      // Realistic quarter differential: ~0.45 pts per 1.0 OVR difference
      const qMyAdvantage = Math.round(diff * 0.45);
      const randomSwing = Math.floor(Math.random() * 5) - 2; // -2 to +2 swing

      let qMy = baseMy + qMyAdvantage + randomSwing;
      let qOpp = baseOpp - qMyAdvantage - randomSwing;

      // Keep quarters within realistic NBA boundaries (18 to 36 pts)
      qMy = Math.max(18, Math.min(36, qMy));
      qOpp = Math.max(18, Math.min(36, qOpp));

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

    onCoinsEarned(coinsWon);

    // If it was a season game, update the standings table!
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
        // Realistic simulation of other NBA teams in standings based on team strength
        const oppTeamOvr = NBA_TEAM_OVR_MAP[team.teamAbbr] || 86;
        const winProbability = Math.max(0.25, Math.min(0.85, 0.5 + (oppTeamOvr - 86) * 0.04));
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
        currentMatchIndex: Math.min(season.totalMatches || 30, season.currentMatchIndex + (isSeasonEnd ? 0 : 1)),
        standings: updatedStandings,
        isCompleted: isSeasonEnd,
        finalRank: isSeasonEnd ? finalUserRank : undefined,
        rewardClaimed: false,
        historyLogs: [
          `Jornada ${season.currentMatchIndex}: Tu Equipo ${curMy} - ${curOpp} ${oppName} (${won ? 'VICTORIA' : 'DERROTA'})`,
          ...season.historyLogs,
        ],
      };

      await StorageService.saveSeason(nextSeason);
      setSeason(nextSeason);

      // If season reached match 30, prepare season awards!
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

    // Award bonus coins for season standing
    onCoinsEarned(seasonEndData.reward.coins);

    // Advance to next season
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

  // Sort Standings Table
  const getSortedStandings = () => {
    if (!season) return [];
    return sortStandingsList(season.standings, standingsConf);
  };

  const selectedTeamData = NBA_TEAMS[selectedOpponentAbbr] || NBA_TEAMS.DEN;

  // Next Season Opponent
  const getNextSeasonOpponent = () => {
    const oppAbbrs = Object.keys(NBA_TEAMS);
    const index = ((season?.currentMatchIndex || 1) - 1) % oppAbbrs.length;
    const abbr = oppAbbrs[index];
    return NBA_TEAMS[abbr] || NBA_TEAMS.BOS;
  };

  const nextSeasonOpponent = getNextSeasonOpponent();
  const nextSeasonOppOvr = getTeamOvrEstimate(nextSeasonOpponent.abbreviation);

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
          <Ionicons name="flash" size={15} color={currentMode === 'QUICK' ? '#FFFFFF' : '#64748B'} style={{ marginRight: 6 }} />
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
            setInfoModalVisible(true);
          }}
          style={styles.infoTopBtn}
        >
          <Ionicons name="information-circle-outline" size={15} color="#006BB6" style={{ marginRight: 4 }} />
          <Text style={styles.infoTopBtnText}>Criterios</Text>
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
                      <Text style={styles.teamBoxOvr}>{nextSeasonOppOvr} OVR</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                      handleStartSimulation(
                        nextSeasonOpponent.name,
                        nextSeasonOpponent.logoUrl,
                        nextSeasonOppOvr,
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
              {/* Table Header */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.thText, { width: 28 }]}>#</Text>
                <Text style={[styles.thText, { flex: 1 }]}>EQUIPO</Text>
                <Text style={[styles.thText, { width: 34, textAlign: 'center' }]}>V</Text>
                <Text style={[styles.thText, { width: 34, textAlign: 'center' }]}>D</Text>
                <Text style={[styles.thText, { width: 48, textAlign: 'center' }]}>%V</Text>
              </View>

              {/* Table Rows */}
              {getSortedStandings().map((row, idx) => {
                const totalGames = row.wins + row.losses;
                const winPct = totalGames > 0 ? (row.wins / totalGames).toFixed(3).replace('0.', '.') : '.000';
                const isPlayoffs = idx < 8;

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

        {/* MODE 2: PARTIDO DE PRÁCTICA / EXHIBICIÓN */}
        {currentMode === 'QUICK' && (
          <View>
            <Text style={styles.sectionHeading}>ELEGIR RIVAL DE PRÁCTICA</Text>
            <Text style={styles.sectionSub}>
              Prueba la química de tus 5 jugadores y director técnico
            </Text>

            {/* Selected Opponent Hero Banner */}
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
                    source={{ uri: selectedTeamData.logoUrl }}
                    style={styles.heroRivalLogo}
                    resizeMode="contain"
                  />
                  <Text numberOfLines={1} style={styles.teamHeroName}>
                    {selectedTeamData.name}
                  </Text>
                  <Text style={styles.teamHeroOvr}>
                    {getTeamOvrEstimate(selectedTeamData.abbreviation)} OVR
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  handleStartSimulation(
                    selectedTeamData.name,
                    selectedTeamData.logoUrl,
                    getTeamOvrEstimate(selectedTeamData.abbreviation),
                    false
                  )
                }
                style={styles.startQuickMatchBtn}
              >
                <Ionicons name="play" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.startQuickMatchBtnText}>
                  ¡SIMULAR PARTIDO DE PRÁCTICA!
                </Text>
              </TouchableOpacity>
            </View>

            {/* 30 NBA Teams Grid */}
            <Text style={styles.allTeamsHeading}>TODAS LAS FRANQUICIAS NBA</Text>
            <View style={styles.teamsGrid}>
              {teamsArray.map((team) => {
                const isSelected = selectedOpponentAbbr === team.abbreviation;
                const teamOvr = getTeamOvrEstimate(team.abbreviation);

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
                    <Text style={styles.teamGridOvr}>{teamOvr} OVR</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
                  {isSeasonMatch ? 'PARTIDO DE TEMPORADA' : 'PARTIDO DE PRÁCTICA'}
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
                {/* Trophy / Medal Big Badge */}
                <View
                  style={[
                    styles.seasonEndIconCircle,
                    { backgroundColor: seasonEndData.reward.color + '18', borderColor: seasonEndData.reward.color },
                  ]}
                >
                  <Ionicon name={seasonEndData.reward.icon} size={38} color={seasonEndData.reward.color} />
                </View>

                {/* Badge Banner */}
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

                {/* Main Title */}
                <Text style={styles.seasonEndMainTitle}>
                  {seasonEndData.reward.title}
                </Text>

                <Text style={styles.seasonEndDesc}>
                  {seasonEndData.reward.description}
                </Text>

                {/* Season Summary Stats Box */}
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

                {/* Coins Won Card */}
                <View style={styles.seasonRewardCoinsCard}>
                  <Text style={styles.rewardCoinsLabel}>RECOMPENSA EXTRA DE TEMPORADA</Text>
                  <View style={styles.rewardCoinsRow}>
                    <Ionicon name="sparkles" size={20} color="#F59E0B" />
                    <Text style={styles.rewardCoinsAmount}>
                      +{seasonEndData.reward.coins.toLocaleString()} MONEDAS
                    </Text>
                  </View>
                </View>

                {/* Claim Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleClaimSeasonReward}
                  style={[styles.claimRewardBigBtn, { backgroundColor: seasonEndData.reward.color }]}
                >
                  <Text style={styles.claimRewardBigBtnText}>
                    RECLAMAR PREMIOS E INICIAR TEMPORADA #{seasonEndData.seasonNumber + 1}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* CRITERIOS DEL PARTIDO MODAL */}
      <Modal visible={infoModalVisible} transparent animationType="fade">
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalCard}>
            <View style={styles.infoModalHeader}>
              <View style={styles.infoModalHeaderLeft}>
                <Ionicons name="information-circle-outline" size={18} color="#006BB6" style={{ marginRight: 6 }} />
                <Text style={styles.infoModalTitle}>¿CÓMO SE DECIDEN LOS PARTIDOS?</Text>
              </View>
              <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.closeInfoBtn}>
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.infoScroll}>
              <Text style={styles.infoIntro}>
                El simulador calcula las anotaciones de cada cuarto en base a 4 pilares estratégicos de la NBA:
              </Text>

              {/* Factor 1: OVR */}
              <View style={styles.infoCardItem}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="shield" size={16} color="#006BB6" />
                </View>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>1. OVR y Media General</Text>
                  <Text style={styles.infoItemText}>
                    La calidad individual de tus 5 titulares determina la capacidad de anotación y contención defensiva. Cada punto de OVR diferencial te da una ventaja directa en puntos por cuarto.
                  </Text>
                </View>
              </View>

              {/* Factor 2: Chemistry */}
              <View style={styles.infoCardItem}>
                <View style={[styles.infoIconBox, { backgroundColor: '#FEF9C3' }]}>
                  <Ionicons name="flash" size={16} color="#CA8A04" />
                </View>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>2. Química de Equipo (%)</Text>
                  <Text style={styles.infoItemText}>
                    Una química alta (80%-100%) genera circulación fluida de balón y minimiza pérdidas. Una química baja (&lt;60%) causa tiros forzados en momentos apretados.
                  </Text>
                </View>
              </View>

              {/* Factor 3: Coach */}
              <View style={styles.infoCardItem}>
                <View style={[styles.infoIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="ribbon" size={16} color="#2563EB" />
                </View>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>3. Táctica del Director Técnico</Text>
                  <Text style={styles.infoItemText}>
                    Los bonus tácticos (+ATQ / +DEF) de tu DT personalizado inclinan posesiones clave en los minutos decisivos.
                  </Text>
                </View>
              </View>

              {/* Factor 4: NBA Variance */}
              <View style={styles.infoCardItem}>
                <View style={[styles.infoIconBox, { backgroundColor: '#FFEDD5' }]}>
                  <Ionicons name="flame" size={16} color="#EA580C" />
                </View>
                <View style={styles.infoItemContent}>
                  <Text style={styles.infoItemTitle}>4. Rachas de Tiro y Varianza NBA</Text>
                  <Text style={styles.infoItemText}>
                    Como en la NBA real (ej. Playoffs), un equipo con 94 OVR puede tener un cuarto encendido de triples o tu equipo una racha fría. Sin embargo, un OVR de 98 te dará siempre una sólida probabilidad de victoria a lo largo de la temporada.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setInfoModalVisible(false)}
              style={styles.understoodBtn}
            >
              <Text style={styles.understoodBtnText}>¡ENTENDIDO!</Text>
            </TouchableOpacity>
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
  topTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 6,
    alignItems: 'center',
  },
  topTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    gap: 5,
  },
  topTabActive: {
    backgroundColor: '#006BB6',
  },
  topTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  topTabTextActive: {
    color: '#FFFFFF',
  },
  infoTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 4,
  },
  infoTopBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#006BB6',
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 30,
  },

  // Fixture Card
  fixtureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  fixtureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
    marginBottom: 10,
  },
  fixtureHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  fixtureTitle: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  resetBtn: {
    padding: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
  },

  // Season Completed Banner in Fixture Card
  seasonCompletedCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  seasonCompletedIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  seasonCompletedTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
    marginBottom: 4,
    textAlign: 'center',
  },
  seasonCompletedSub: {
    fontSize: 11.5,
    color: '#B45309',
    textAlign: 'center',
    marginBottom: 12,
  },
  claimSeasonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    width: '100%',
  },
  claimSeasonBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  matchupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  teamBox: {
    flex: 1,
    alignItems: 'center',
  },
  teamBoxLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#006BB6',
    marginBottom: 2,
  },
  teamBoxName: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
    textAlign: 'center',
  },
  teamBoxOvr: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  teamBoxChem: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: 'bold',
    marginTop: 2,
  },
  rivalLogo: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  vsBadge: {
    fontSize: 13,
    fontWeight: '900',
    color: '#94A3B8',
    paddingHorizontal: 10,
  },
  playSeasonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006BB6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  playSeasonBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Standings Header
  standingsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  standingsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  confFilterPills: {
    flexDirection: 'row',
    gap: 4,
  },
  confPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  confPillActive: {
    backgroundColor: '#006BB6',
  },
  confPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  confPillTextActive: {
    color: '#FFFFFF',
  },

  // Table
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  thText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  tableRowUser: {
    backgroundColor: '#EFF6FF',
  },
  playoffCutoffRow: {
    borderBottomWidth: 2,
    borderBottomColor: '#BFDBFE',
  },
  rankText: {
    width: 28,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
  },
  userHighlightText: {
    color: '#006BB6',
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
    fontSize: 11.5,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  statCell: {
    width: 34,
    fontSize: 11,
    color: '#334155',
    textAlign: 'center',
  },
  pctCell: {
    width: 48,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },

  // Quick Practice Section
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 12,
  },
  quickMatchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  matchupBanner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  teamHeroBox: {
    alignItems: 'center',
    flex: 1,
  },
  teamHeroLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
  },
  teamHeroName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
    textAlign: 'center',
  },
  teamHeroOvr: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006BB6',
  },
  teamHeroChem: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: 'bold',
    marginTop: 2,
  },
  heroRivalLogo: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  vsBadgeLarge: {
    fontSize: 15,
    fontWeight: '900',
    color: '#94A3B8',
    paddingHorizontal: 8,
  },
  startQuickMatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006BB6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  startQuickMatchBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  allTeamsHeading: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  quickSection: {
    gap: 12,
  },
  quickOpponentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  teamGridCard: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  teamGridCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#006BB6',
    borderWidth: 2,
  },
  teamGridLogo: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  teamGridName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  teamGridOvr: {
    fontSize: 9.5,
    color: '#64748B',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
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
    gap: 6,
  },
  simHeaderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeSimBtn: {
    padding: 4,
  },
  simScoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  simScoreTeam: {
    alignItems: 'center',
    flex: 1,
  },
  simScoreTeamName: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 2,
  },
  simScoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  simScoreDivider: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  simStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  simLogsContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 10,
    gap: 4,
    marginBottom: 14,
  },
  simLogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  simLogText: {
    fontSize: 11,
    color: '#334155',
    flex: 1,
  },
  simDoneBox: {
    alignItems: 'center',
  },
  simResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  simCoinsReward: {
    fontSize: 12,
    color: '#CA8A04',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  simContinueBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  simContinueBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Season End Awards Ceremony Modal
  seasonEndOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  seasonEndCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  seasonEndIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  seasonEndRankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  seasonEndRankBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  seasonEndMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  seasonEndDesc: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  seasonStatsBox: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
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

  // Criterios Modal
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
