import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NBAPlayer, UserCard } from '../types';
import { SoundService } from '../services/sound';
import { HapticsService } from '../services/haptics';
import { StorageService } from '../services/storage';
import { ACTIVE_NBA_PLAYERS } from '../data/nbaPlayers';
import { CLASSIC_TEAMS } from '../data/classicTeams';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { earnCoins } from '../store/slices/squadSlice';
import { useTheme } from '../context/ThemeContext';

interface ThreePointContestProps {
  visible: boolean;
  onClose: () => void;
  inventoryCards?: UserCard[];
  onCoinsEarned?: (coins: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 5 perimeter racks in the All-Star 3PT Contest
const RACKS = [
  { id: 1, name: 'Esquina Izquierda', shortName: 'Esq. Izq' },
  { id: 2, name: 'Ala Izquierda', shortName: 'Ala Izq' },
  { id: 3, name: 'Tope de la Llave', shortName: 'Centro' },
  { id: 4, name: 'Ala Derecha', shortName: 'Ala Der' },
  { id: 5, name: 'Esquina Derecha', shortName: 'Esq. Der' },
];

export const ThreePointContestScreen: React.FC<ThreePointContestProps> = ({
  visible,
  onClose,
  inventoryCards: propsInventoryCards,
  onCoinsEarned,
}) => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const reduxCards = useAppSelector((state) => state.squad.cards);
  const inventoryCards = propsInventoryCards || reduxCards;

  const handleEarnCoins = (coins: number) => {
    if (onCoinsEarned) {
      onCoinsEarned(coins);
    } else {
      dispatch(earnCoins(coins));
    }
  };
  // Game States
  const [gameState, setGameState] = useState<'SELECT' | 'PLAYING' | 'RESULT'>('SELECT');
  const [selectedPlayer, setSelectedPlayer] = useState<NBAPlayer | null>(null);
  const [sourceTab, setSourceTab] = useState<'INVENTORY' | 'ALL_STARS'>('INVENTORY');
  
  // High Score Record
  const [highScore, setHighScore] = useState<{ score: number; shooterName: string }>({
    score: 0,
    shooterName: 'Ninguno',
  });
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Contest Progress State
  const [currentRackIndex, setCurrentRackIndex] = useState(0); // 0 to 4
  const [currentBallIndex, setCurrentBallIndex] = useState(0); // 0 to 4 (ball 4 is Money Ball)
  const [score, setScore] = useState(0);
  const [rackScores, setRackScores] = useState<boolean[][]>([
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lastShotResult, setLastShotResult] = useState<{
    text: string;
    isMake: boolean;
    isPerfect: boolean;
    isMoneyBall: boolean;
  } | null>(null);

  // Animation values
  const meterAnim = useRef(new Animated.Value(0)).current; // 0 to 100
  const meterLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const shotBallScale = useRef(new Animated.Value(0)).current;
  const shotBallY = useRef(new Animated.Value(0)).current;
  const isShootingRef = useRef(false);
  const timerRef = useRef<any>(null);
  const currentMeterValRef = useRef(0);

  // Track animated value for reading in shoot handler
  useEffect(() => {
    const id = meterAnim.addListener(({ value }) => {
      currentMeterValRef.current = value;
    });
    return () => {
      meterAnim.removeListener(id);
    };
  }, [meterAnim]);

  // Load High Score on mount / open
  useEffect(() => {
    if (visible) {
      loadHighScore();
      setGameState('SELECT');
    }
  }, [visible]);

  const loadHighScore = async () => {
    const record = await StorageService.getThreePointHighScore();
    setHighScore(record);
  };

  // Compile list of players sorted strictly descending by threePoint stat
  const getSortedShooters = (): { player: NBAPlayer; rarity?: string; count?: number }[] => {
    if (sourceTab === 'INVENTORY') {
      // Map user's inventory cards
      const map = new Map<string, { player: NBAPlayer; rarity: string; count: number }>();
      inventoryCards.forEach((c) => {
        if (!c.player) return;
        const existing = map.get(c.player.id);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(c.player.id, {
            player: c.player,
            rarity: c.player.rarity || 'GOLD',
            count: 1,
          });
        }
      });
      const list = Array.from(map.values());
      // Sort strictly descending by threePoint
      list.sort((a, b) => (b.player.stats.threePoint || 0) - (a.player.stats.threePoint || 0));
      return list;
    } else {
      // Pool of All-Star & Icon elite snipers
      const iconPlayers: NBAPlayer[] = [];
      CLASSIC_TEAMS.forEach((t) => {
        t.starters.forEach((p: NBAPlayer) => {
          if (p.stats.threePoint && p.stats.threePoint >= 80) {
            iconPlayers.push(p);
          }
        });
      });
      const activeSnipers = ACTIVE_NBA_PLAYERS.filter((p) => p.stats.threePoint && p.stats.threePoint >= 80);
      const combined = [...activeSnipers, ...iconPlayers];
      // Deduplicate by name
      const unique = new Map<string, NBAPlayer>();
      combined.forEach((p) => {
        if (!unique.has(p.name) || (p.stats.threePoint || 0) > (unique.get(p.name)?.stats.threePoint || 0)) {
          unique.set(p.name, p);
        }
      });
      const list = Array.from(unique.values()).map((p) => ({
        player: p,
        rarity: p.rarity || 'GOLD',
      }));
      // Sort strictly descending by threePoint
      list.sort((a, b) => (b.player.stats.threePoint || 0) - (a.player.stats.threePoint || 0));
      return list;
    }
  };

  const sortedShooters = getSortedShooters();

  // Helper for 3PT badge
  const getSniperTier = (threePoint: number) => {
    if (threePoint >= 96) return { label: '🔥 Francotirador Histórico', color: '#DC2626', bg: '#FEE2E2' };
    if (threePoint >= 90) return { label: '🎯 Triplista Élite', color: '#D97706', bg: '#FEF3C7' };
    if (threePoint >= 82) return { label: '⭐ Tirador Confiable', color: '#2563EB', bg: '#DBEAFE' };
    return { label: '🏀 Tirador Ocasional', color: '#64748B', bg: '#F1F5F9' };
  };

  // Compute Green Window Width based on 3PT Stat
  // Range: 60 3PT -> ~6% width, 99 3PT -> ~18% width
  const getGreenWindowWidth = (threePoint: number) => {
    const clamped = Math.max(60, Math.min(99, threePoint));
    const width = 6 + ((clamped - 60) / 39) * 12; // 6% to 18%
    return Math.round(width * 10) / 10;
  };

  // Start the Contest
  const handleStartContest = (player: NBAPlayer) => {
    HapticsService.selectionTick();
    setSelectedPlayer(player);
    setCurrentRackIndex(0);
    setCurrentBallIndex(0);
    setScore(0);
    setRackScores([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]);
    setTimeLeft(60);
    setIsNewRecord(false);
    setLastShotResult(null);
    setGameState('PLAYING');
    isShootingRef.current = false;

    // Start Shot Meter Animation
    startMeterLoop(player.stats.threePoint || 80);

    // Start Countdown Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinishContest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Shot Meter Animation Loop
  const startMeterLoop = (threePoint: number) => {
    const duration = 520 + (threePoint - 80) * 3;
    meterAnim.setValue(0);

    const runLoop = () => {
      meterLoopRef.current = Animated.sequence([
        Animated.timing(meterAnim, {
          toValue: 100,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(meterAnim, {
          toValue: 0,
          duration,
          useNativeDriver: false,
        }),
      ]);
      meterLoopRef.current.start((result) => {
        if (result.finished) {
          runLoop();
        }
      });
    };
    runLoop();
  };

  // Shoot Action
  const handleShoot = () => {
    if (isShootingRef.current || !selectedPlayer || gameState !== 'PLAYING') return;
    isShootingRef.current = true;

    const meterVal = currentMeterValRef.current;
    const threePoint = selectedPlayer.stats.threePoint || 80;
    const greenWidth = getGreenWindowWidth(threePoint);
    const greenMin = 50 - greenWidth / 2;
    const greenMax = 50 + greenWidth / 2;

    const isMoneyBall = currentBallIndex === 4;
    const isPerfect = meterVal >= greenMin && meterVal <= greenMax;
    
    // Good (Yellow) window is +/- 12% outside green
    const yellowMin = greenMin - 12;
    const yellowMax = greenMax + 12;
    const isYellow = !isPerfect && meterVal >= yellowMin && meterVal <= yellowMax;

    // Probability of making in yellow zone based on 3PT rating (45% to 80%)
    const yellowMakeChance = 0.45 + ((threePoint - 70) / 30) * 0.35;
    const isMake = isPerfect || (isYellow && Math.random() < yellowMakeChance);

    // Audio & Haptics
    if (isPerfect) {
      HapticsService.celebrate();
      if (isMoneyBall) {
        SoundService.playMoneyBall();
      } else {
        SoundService.playSwish();
      }
    } else if (isMake) {
      HapticsService.selectionTick();
      SoundService.playSwish();
    } else {
      HapticsService.mediumImpact();
      SoundService.playClank();
    }

    // Shot feedback label
    let feedbackText = '¡FALLO! ❌';
    if (isPerfect) {
      feedbackText = isMoneyBall ? '¡MONEY BALL PERFECTO! 🔥 +2' : '¡GREEN RELEASE! 🟢 +1';
    } else if (isMake) {
      feedbackText = isMoneyBall ? '¡MONEY BALL ADENTRO! 💰 +2' : '¡TIRO ENCESTADO! 🎯 +1';
    }

    setLastShotResult({
      text: feedbackText,
      isMake,
      isPerfect,
      isMoneyBall,
    });

    // Update Score & Rack Records
    const pts = isMake ? (isMoneyBall ? 2 : 1) : 0;
    setScore((prev) => prev + pts);

    setRackScores((prev) => {
      const next = prev.map((r) => [...r]);
      next[currentRackIndex][currentBallIndex] = isMake;
      return next;
    });

    // Animate Ball Flight
    shotBallScale.setValue(0.6);
    shotBallY.setValue(0);
    Animated.parallel([
      Animated.timing(shotBallScale, {
        toValue: 1.2,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(shotBallY, {
        toValue: -30,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Advance to next ball or rack
      setTimeout(() => {
        if (currentBallIndex < 4) {
          setCurrentBallIndex((prev) => prev + 1);
          isShootingRef.current = false;
        } else {
          // Finished current rack
          if (currentRackIndex < 4) {
            setCurrentRackIndex((prev) => prev + 1);
            setCurrentBallIndex(0);
            HapticsService.selectionTick();
            isShootingRef.current = false;
          } else {
            // Completed all 5 racks!
            handleFinishContest();
          }
        }
      }, 180);
    });
  };

  // Finish Contest & Calculate Rewards
  const handleFinishContest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (meterLoopRef.current) meterLoopRef.current.stop();
    meterAnim.stopAnimation();

    setGameState('RESULT');
    SoundService.playVictory();
    HapticsService.celebrate();

    // Reward Tier calculation
    let earnedCoins = 25;
    if (score >= 25) earnedCoins = 350;
    else if (score >= 20) earnedCoins = 200;
    else if (score >= 15) earnedCoins = 120;
    else if (score >= 10) earnedCoins = 60;

    // Check High Score
    if (selectedPlayer) {
      const isRecord = await StorageService.saveThreePointHighScore(score, selectedPlayer.name);
      if (isRecord) {
        setIsNewRecord(true);
        earnedCoins += 150; // Bonus for setting new all-time record!
        setHighScore({ score, shooterName: selectedPlayer.name });
      }
    }

    handleEarnCoins(earnedCoins);
  };

  const handleExit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (meterLoopRef.current) meterLoopRef.current.stop();
    meterAnim.stopAnimation();
    onClose();
  };

  const rewardCoinsEarned = () => {
    let earned = 25;
    if (score >= 25) earned = 350;
    else if (score >= 20) earned = 200;
    else if (score >= 15) earned = 120;
    else if (score >= 10) earned = 60;
    if (isNewRecord) earned += 150;
    return earned;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleExit}>
      <View style={styles.container}>
        {/* TOP HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExit} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerBadge}>
              <Ionicons name="flame" size={14} color="#EF4444" style={{ marginRight: 4 }} />
              <Text style={styles.headerBadgeText}>MINIJUEGO ALL-STAR</Text>
            </View>
            <Text style={styles.headerTitle}>Concurso de Triples</Text>
          </View>
          <View style={styles.recordBox}>
            <Ionicons name="trophy" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
            <Text style={styles.recordText}>
              Récord: <Text style={{ fontWeight: '800', color: '#F59E0B' }}>{highScore.score} pts</Text>
            </Text>
          </View>
        </View>

        {/* 1. SELECTION SCREEN */}
        {gameState === 'SELECT' && (
          <View style={[styles.selectContainer, { backgroundColor: colors.bg }]}>
            {/* Shooter Source Tabs */}
            <View style={styles.tabsRow}>
              <TouchableOpacity
                onPress={() => {
                  HapticsService.selectionTick();
                  setSourceTab('INVENTORY');
                }}
                style={[
                  styles.tabBtn,
                  { backgroundColor: colors.bgCardSecondary },
                  sourceTab === 'INVENTORY' && styles.tabBtnActive,
                ]}
              >
                <Ionicons
                  name="albums"
                  size={15}
                  color={sourceTab === 'INVENTORY' ? '#FFFFFF' : colors.textMuted}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.tabBtnText, { color: colors.textMuted }, sourceTab === 'INVENTORY' && styles.tabBtnTextActive]}>
                  Mis Cartas ({inventoryCards.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  HapticsService.selectionTick();
                  setSourceTab('ALL_STARS');
                }}
                style={[
                  styles.tabBtn,
                  { backgroundColor: colors.bgCardSecondary },
                  sourceTab === 'ALL_STARS' && styles.tabBtnActive,
                ]}
              >
                <Ionicons
                  name="star"
                  size={15}
                  color={sourceTab === 'ALL_STARS' ? '#FFFFFF' : colors.textMuted}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.tabBtnText, { color: colors.textMuted }, sourceTab === 'ALL_STARS' && styles.tabBtnTextActive]}>
                  Tiradores All-Star
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter / Sort Explanation Banner */}
            <View style={[styles.sortNoticeBanner, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: colors.border }]}>
              <Ionicons name="filter" size={14} color={isDark ? '#38BDF8' : '#1D428A'} style={{ marginRight: 6 }} />
              <Text style={[styles.sortNoticeText, { color: isDark ? '#93C5FD' : '#1D428A' }]}>
                Ordenados de mayor a menor según <Text style={{ fontWeight: '800' }}>Estadística de Triples (3PT)</Text>.
              </Text>
            </View>

            {/* List of Sorted Shooters */}
            {sortedShooters.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="basketball-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No tienes cartas en tu inventario</Text>
                <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                  Abre sobres en la tienda o selecciona la pestaña de "Tiradores All-Star" para jugar de inmediato.
                </Text>
                <TouchableOpacity
                  onPress={() => setSourceTab('ALL_STARS')}
                  style={styles.emptyActionBtn}
                >
                  <Ionicons name="star" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.emptyActionBtnText}>Ver Tiradores All-Star</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.shooterList}>
                {sortedShooters.map(({ player, count }, index) => {
                  const threePt = player.stats.threePoint || 75;
                  const tier = getSniperTier(threePt);
                  const greenWidth = getGreenWindowWidth(threePt);

                  return (
                    <TouchableOpacity
                      key={`${player.id}-${index}`}
                      activeOpacity={0.85}
                      onPress={() => handleStartContest(player)}
                      style={[styles.shooterCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                    >
                      {/* Rank Indicator */}
                      <View style={styles.rankBadge}>
                        <Text style={[styles.rankBadgeText, { color: colors.textMuted }]}>#{index + 1}</Text>
                      </View>

                      {/* Player Image */}
                      <Image
                        source={{ uri: player.imageUrl }}
                        style={styles.shooterImg}
                        resizeMode="contain"
                      />

                      {/* Player Info */}
                      <View style={styles.shooterInfo}>
                        <View style={styles.shooterNameRow}>
                          <Text numberOfLines={1} style={[styles.shooterName, { color: colors.text }]}>
                            {player.name}
                          </Text>
                          {count && count > 1 ? (
                            <View style={styles.countBadge}>
                              <Text style={styles.countBadgeText}>x{count}</Text>
                            </View>
                          ) : null}
                        </View>

                        <Text style={[styles.shooterSub, { color: colors.textMuted }]}>
                          {player.teamAbbr} · {player.position} · {player.stats.ovr} OVR
                        </Text>

                        {/* Sniper Tier Tag */}
                        <View style={[styles.tierTag, { backgroundColor: tier.bg }]}>
                          <Text style={[styles.tierTagText, { color: tier.color }]}>{tier.label}</Text>
                        </View>
                      </View>

                      {/* Prominent 3PT Stat Box */}
                      <View style={[styles.threePtBox, { backgroundColor: isDark ? '#450A0A55' : '#FEF2F2', borderColor: isDark ? '#7F1D1D' : '#FCA5A5' }]}>
                        <Text style={styles.threePtLabel}>3PT</Text>
                        <Text style={styles.threePtValue}>{threePt}</Text>
                        <Text style={styles.windowSubText}>Verde: {greenWidth}%</Text>
                      </View>

                      {/* Play Action Arrow */}
                      <View style={[styles.actionArrow, { backgroundColor: isDark ? '#1E3A8A44' : '#EFF6FF' }]}>
                        <Ionicons name="play" size={16} color={isDark ? '#38BDF8' : '#1D428A'} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}

        {/* 2. CONTEST GAMEPLAY SCREEN */}
        {gameState === 'PLAYING' && selectedPlayer && (
          <View style={styles.gameplayContainer}>
            {/* Top Scoreboard Bar */}
            <View style={styles.scoreboard}>
              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>PUNTOS</Text>
                <Text style={styles.scoreItemVal}>{score}</Text>
                <Text style={styles.scoreItemSub}>/ 30 max</Text>
              </View>

              <View style={styles.shooterPreview}>
                <Image
                  source={{ uri: selectedPlayer.imageUrl }}
                  style={styles.shooterPreviewImg}
                  resizeMode="contain"
                />
                <View>
                  <Text numberOfLines={1} style={styles.shooterPreviewName}>
                    {selectedPlayer.name}
                  </Text>
                  <Text style={styles.shooterPreview3pt}>
                    🎯 3PT: <Text style={{ fontWeight: '800', color: '#DC2626' }}>{selectedPlayer.stats.threePoint}</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.scoreItem}>
                <Text style={styles.scoreItemLabel}>TIEMPO</Text>
                <Text style={[styles.scoreItemVal, timeLeft <= 10 && { color: '#EF4444' }]}>
                  {timeLeft}s
                </Text>
                <Text style={styles.scoreItemSub}>Restante</Text>
              </View>
            </View>

            {/* 5 RACKS PROGRESSION MAP */}
            <View style={styles.racksMap}>
              {RACKS.map((rack, idx) => {
                const isActive = idx === currentRackIndex;
                const isCompleted = idx < currentRackIndex;
                const rackHitCount = rackScores[idx].filter(Boolean).length;

                return (
                  <View key={rack.id} style={styles.rackMapItem}>
                    <View
                      style={[
                        styles.rackCircle,
                        isActive && styles.rackCircleActive,
                        isCompleted && styles.rackCircleDone,
                      ]}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      ) : (
                        <Text style={[styles.rackCircleText, isActive && styles.rackCircleTextActive]}>
                          {idx + 1}
                        </Text>
                      )}
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.rackMapLabel,
                        isActive && styles.rackMapLabelActive,
                        isCompleted && styles.rackMapLabelDone,
                      ]}
                    >
                      {rack.shortName}
                    </Text>
                    <Text style={styles.rackScoreTag}>
                      {isCompleted ? `${rackHitCount}/5` : isActive ? 'Activo' : '-'}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* COURT & HOOP VISUALIZATION */}
            <View style={styles.courtArea}>
              {/* Stylized 3PT Arc */}
              <View style={styles.courtArc} />
              
              {/* Hoop & Net */}
              <View style={styles.hoopContainer}>
                <View style={styles.backboard} />
                <View style={styles.hoopRim} />
                <View style={styles.netLine} />
              </View>

              {/* Shot Result Dynamic Feedback Overlay */}
              {lastShotResult && (
                <View
                  style={[
                    styles.shotFeedbackBubble,
                    lastShotResult.isPerfect
                      ? styles.feedbackPerfect
                      : lastShotResult.isMake
                      ? styles.feedbackMake
                      : styles.feedbackMiss,
                  ]}
                >
                  <Text style={styles.shotFeedbackText}>{lastShotResult.text}</Text>
                </View>
              )}

              {/* Active Rack Balls Display */}
              <View style={styles.rackBallsRow}>
                <Text style={styles.rackTitleText}>
                  {RACKS[currentRackIndex].name.toUpperCase()} · Balón {currentBallIndex + 1} de 5
                </Text>
                <View style={styles.ballsIconsContainer}>
                  {[0, 1, 2, 3, 4].map((ballIdx) => {
                    const isMoney = ballIdx === 4;
                    const isShot = ballIdx < currentBallIndex;
                    const isCurrent = ballIdx === currentBallIndex;
                    const isMake = rackScores[currentRackIndex][ballIdx];

                    return (
                      <View
                        key={ballIdx}
                        style={[
                          styles.ballSlot,
                          isCurrent && styles.ballSlotActive,
                          isShot && (isMake ? styles.ballSlotMake : styles.ballSlotMiss),
                        ]}
                      >
                        <Ionicons
                          name="basketball"
                          size={isCurrent ? 24 : 18}
                          color={
                            isMoney
                              ? '#F59E0B' // Money Ball Golden/Tricolor
                              : isShot
                              ? isMake
                                ? '#10B981'
                                : '#64748B'
                              : '#EA580C' // Regular Orange Ball
                          }
                        />
                        {isMoney && (
                          <View style={styles.moneyBadge}>
                            <Text style={styles.moneyBadgeText}>2X</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* DYNAMIC SHOT METER */}
            <View style={styles.meterContainer}>
              <View style={styles.meterLabelRow}>
                <Text style={styles.meterTitle}>TIMING DE TIRO</Text>
                <Text style={styles.meterSub}>
                  Presiona LANZAR en la <Text style={{ color: '#10B981', fontWeight: '800' }}>Zona Verde</Text>
                </Text>
              </View>

              {/* Meter Track */}
              <View style={styles.meterTrack}>
                {/* Early Zone (Red) */}
                <View style={[styles.meterZone, styles.zoneRed, { flex: 1 }]} />
                {/* Slightly Early Zone (Yellow) */}
                <View style={[styles.meterZone, styles.zoneYellow, { flex: 0.8 }]} />
                {/* PERFECT GREEN ZONE (Width scaled to player's 3PT rating) */}
                <View
                  style={[
                    styles.meterZone,
                    styles.zoneGreen,
                    {
                      width: `${getGreenWindowWidth(selectedPlayer.stats.threePoint || 80)}%`,
                    },
                  ]}
                >
                  <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                </View>
                {/* Slightly Late Zone (Yellow) */}
                <View style={[styles.meterZone, styles.zoneYellow, { flex: 0.8 }]} />
                {/* Late Zone (Red) */}
                <View style={[styles.meterZone, styles.zoneRed, { flex: 1 }]} />

                {/* Animated Needle */}
                <Animated.View
                  style={[
                    styles.meterNeedle,
                    {
                      left: meterAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '96%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            {/* BIG SHOOT BUTTON */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleShoot}
              style={[
                styles.shootBtn,
                currentBallIndex === 4 && styles.shootBtnMoney,
              ]}
            >
              <Ionicons
                name="basketball"
                size={28}
                color="#FFFFFF"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.shootBtnText}>
                {currentBallIndex === 4 ? '¡LANZAR MONEY BALL (+2 PTS)!' : '¡LANZAR TRIPLE (+1 PT)!'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3. CONTEST RESULT MODAL */}
        {gameState === 'RESULT' && selectedPlayer && (
          <View style={styles.resultContainer}>
            <View style={[styles.resultCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={styles.resultTrophyWrap}>
                <Ionicons
                  name={score >= 20 ? 'trophy' : score >= 10 ? 'medal' : 'ribbon'}
                  size={44}
                  color={score >= 20 ? '#F59E0B' : '#0284C7'}
                />
              </View>

              {isNewRecord && (
                <View style={styles.newRecordBadge}>
                  <Ionicons name="flame" size={14} color="#DC2626" style={{ marginRight: 4 }} />
                  <Text style={styles.newRecordText}>¡NUEVO RÉCORD HISTÓRICO!</Text>
                </View>
              )}

              <Text style={[styles.resultTitle, { color: colors.text }]}>
                {score >= 25
                  ? '¡CAMPEÓN DEL ALL-STAR!'
                  : score >= 20
                  ? '¡ACTUACIÓN DE GALA!'
                  : score >= 15
                  ? '¡GRAN FRANCOTIRADOR!'
                  : score >= 10
                  ? '¡BUENA PARTICIPACIÓN!'
                  : '¡SIGUE PRACTICANDO!'}
              </Text>

              <Text style={[styles.resultShooterName, { color: colors.textMuted }]}>Tirador: {selectedPlayer.name}</Text>

              {/* Big Score Box */}
              <View style={styles.resultScoreBox}>
                <Text style={styles.resultScoreNum}>{score}</Text>
                <Text style={styles.resultScoreMax}>/ 30 PUNTOS</Text>
              </View>

              {/* Coin Reward Banner */}
              <View style={[styles.rewardBanner, { backgroundColor: isDark ? '#78350F33' : '#FEF3C7', borderColor: '#F59E0B' }]}>
                <Ionicons name="cash" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
                <Text style={[styles.rewardBannerText, { color: isDark ? '#FDE047' : '#92400E' }]}>
                  Recompensa: <Text style={{ fontWeight: '800' }}>+{rewardCoinsEarned()} Monedas</Text>
                </Text>
              </View>

              {/* Racks Breakdown */}
              <View style={styles.breakdownRow}>
                {RACKS.map((r, i) => {
                  const hits = rackScores[i].filter(Boolean).length;
                  return (
                    <View key={r.id} style={[styles.breakdownItem, { backgroundColor: colors.bgCardSecondary, borderColor: colors.border }]}>
                      <Text style={[styles.breakdownLabel, { color: colors.textMuted }]}>{r.shortName}</Text>
                      <Text style={[styles.breakdownVal, { color: colors.text }]}>{hits}/5</Text>
                    </View>
                  );
                })}
              </View>

              {/* Action Buttons */}
              <View style={styles.resultActions}>
                <TouchableOpacity
                  onPress={() => setGameState('SELECT')}
                  style={styles.playAgainBtn}
                >
                  <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.playAgainText}>Otro Tirador</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStartContest(selectedPlayer)}
                  style={styles.retrySameBtn}
                >
                  <Ionicons name="repeat" size={16} color="#1D428A" style={{ marginRight: 6 }} />
                  <Text style={styles.retrySameText}>Reintentar</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleExit} style={styles.exitToMenuBtn}>
                <Text style={styles.exitToMenuText}>Volver a Partidos</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#1C2541',
    borderBottomWidth: 1,
    borderBottomColor: '#2C3A5A',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  headerBadgeText: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  recordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  recordText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },

  // SELECT SCREEN
  selectContainer: {
    flex: 1,
    padding: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#1C2541',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#1D428A',
  },
  tabBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  sortNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF3FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  sortNoticeText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '500',
  },
  shooterList: {
    paddingBottom: 30,
  },
  shooterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankBadge: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '800',
  },
  shooterImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  shooterInfo: {
    flex: 1,
  },
  shooterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shooterName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  countBadgeText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
  },
  shooterSub: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  tierTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  tierTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  threePtBox: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginRight: 6,
  },
  threePtLabel: {
    color: '#991B1B',
    fontSize: 9,
    fontWeight: '800',
  },
  threePtValue: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: '900',
  },
  windowSubText: {
    color: '#059669',
    fontSize: 8,
    fontWeight: '700',
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D428A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // GAMEPLAY SCREEN
  gameplayContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C2541',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2C3A5A',
  },
  scoreItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  scoreItemLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scoreItemVal: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  scoreItemSub: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  shooterPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B132B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2C3A5A',
  },
  shooterPreviewImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 8,
  },
  shooterPreviewName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    maxWidth: 110,
  },
  shooterPreview3pt: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },

  // RACKS MAP
  racksMap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C2541',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  rackMapItem: {
    alignItems: 'center',
    flex: 1,
  },
  rackCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2C3A5A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  rackCircleActive: {
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  rackCircleDone: {
    backgroundColor: '#10B981',
  },
  rackCircleText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
  },
  rackCircleTextActive: {
    color: '#FFFFFF',
  },
  rackMapLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
  },
  rackMapLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  rackMapLabelDone: {
    color: '#10B981',
  },
  rackScoreTag: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 1,
  },

  // COURT & HOOP
  courtArea: {
    flex: 1,
    backgroundColor: '#162238',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#243452',
    position: 'relative',
    overflow: 'hidden',
  },
  courtArc: {
    position: 'absolute',
    top: 50,
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    borderRadius: (SCREEN_WIDTH * 0.75) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  hoopContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  backboard: {
    width: 60,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    marginBottom: 2,
  },
  hoopRim: {
    width: 32,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#EA580C',
    backgroundColor: 'transparent',
  },
  netLine: {
    width: 22,
    height: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  shotFeedbackBubble: {
    position: 'absolute',
    top: 55,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  feedbackPerfect: {
    backgroundColor: '#059669',
  },
  feedbackMake: {
    backgroundColor: '#2563EB',
  },
  feedbackMiss: {
    backgroundColor: '#DC2626',
  },
  shotFeedbackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  rackBallsRow: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  rackTitleText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  ballsIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B132B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2C3A5A',
  },
  ballSlot: {
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 4,
    borderRadius: 8,
  },
  ballSlotActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ scale: 1.15 }],
  },
  ballSlotMake: {
    opacity: 0.7,
  },
  ballSlotMiss: {
    opacity: 0.3,
  },
  moneyBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  moneyBadgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900',
  },

  // SHOT METER
  meterContainer: {
    backgroundColor: '#1C2541',
    borderRadius: 14,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#2C3A5A',
  },
  meterLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  meterTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  meterSub: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  meterTrack: {
    height: 28,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B132B',
    paddingHorizontal: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  meterZone: {
    height: 20,
    borderRadius: 4,
    marginHorizontal: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneRed: {
    backgroundColor: '#DC2626',
    opacity: 0.7,
  },
  zoneYellow: {
    backgroundColor: '#F59E0B',
    opacity: 0.85,
  },
  zoneGreen: {
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  meterNeedle: {
    position: 'absolute',
    width: 6,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },

  // SHOOT BUTTON
  shootBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  shootBtnMoney: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  shootBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // RESULT SCREEN
  resultContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  resultTrophyWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  newRecordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  newRecordText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
  },
  resultTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  resultShooterName: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 12,
  },
  resultScoreBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 14,
  },
  resultScoreNum: {
    color: '#F59E0B',
    fontSize: 38,
    fontWeight: '900',
    marginRight: 6,
  },
  resultScoreMax: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 14,
  },
  rewardBannerText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  breakdownItem: {
    alignItems: 'center',
    flex: 1,
  },
  breakdownLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
  },
  breakdownVal: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  resultActions: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  playAgainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D428A',
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 6,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  retrySameBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF3FF',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 6,
  },
  retrySameText: {
    color: '#1D428A',
    fontSize: 13,
    fontWeight: '800',
  },
  exitToMenuBtn: {
    paddingVertical: 8,
  },
  exitToMenuText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
