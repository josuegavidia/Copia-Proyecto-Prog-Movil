import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { PackDefinition, UserCard, NBAPlayer } from '../../types';
import { NBACard } from '../Card/NBACard';
import { PlayerDetailModal } from '../Card/PlayerDetailModal';
import { HapticsService } from '../../services/haptics';
import { SoundService } from '../../services/sound';
import { openPack } from '../../services/packOpener';
import { RARITY_COLORS } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PackOpeningModalProps {
  visible: boolean;
  pack: PackDefinition | null;
  onClose: () => void;
  onCardsObtained: (newCards: UserCard[]) => void;
}

type Stage = 'SHAKE_TO_OPEN' | 'REVEALING' | 'SUMMARY';

export const PackOpeningModal: React.FC<PackOpeningModalProps> = ({
  visible,
  pack,
  onClose,
  onCardsObtained,
}) => {
  const [stage, setStage] = useState<Stage>('SHAKE_TO_OPEN');
  const [pulledCards, setPulledCards] = useState<UserCard[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const [inspectedPlayer, setInspectedPlayer] = useState<NBAPlayer | null>(null);

  // Animations
  const wobbleAnim = useRef(new Animated.Value(0)).current;

  // Shake detector state refs
  const shakeCountRef = useRef(0);
  const lastShakeTime = useRef(0);
  const isOpenedRef = useRef(false);
  const lastDirectionRef = useRef<'left' | 'right' | null>(null);

  const REQUIRED_SHAKES = 3;

  useEffect(() => {
    if (visible && pack) {
      setStage('SHAKE_TO_OPEN');
      setPulledCards([]);
      setCurrentRevealIndex(0);
      setShakeCount(0);
      setInspectedPlayer(null);
      shakeCountRef.current = 0;
      isOpenedRef.current = false;
      lastShakeTime.current = Date.now();
      lastDirectionRef.current = null;

      Accelerometer.setUpdateInterval(80);
      const subscription = Accelerometer.addListener((data) => {
        if (isOpenedRef.current) return;

        const x = data.x;
        const now = Date.now();

        if (now - lastShakeTime.current > 200) {
          if (x > 0.45 && lastDirectionRef.current !== 'right') {
            lastDirectionRef.current = 'right';
            lastShakeTime.current = now;
            registerShake('right');
          } else if (x < -0.45 && lastDirectionRef.current !== 'left') {
            lastDirectionRef.current = 'left';
            lastShakeTime.current = now;
            registerShake('left');
          }
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [visible, pack]);

  const registerShake = (dir?: 'left' | 'right') => {
    if (isOpenedRef.current || !pack) return;

    shakeCountRef.current += 1;
    const current = shakeCountRef.current;
    setShakeCount(current);

    HapticsService.packTearProgress(current / REQUIRED_SHAKES);

    const tiltValue = dir === 'left' ? -22 : 22;

    Animated.sequence([
      Animated.timing(wobbleAnim, {
        toValue: tiltValue,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(wobbleAnim, {
        toValue: -tiltValue / 2,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(wobbleAnim, {
        toValue: 0,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();

    if (current >= REQUIRED_SHAKES) {
      isOpenedRef.current = true;
      triggerPackBurst();
    }
  };

  const triggerPackBurst = () => {
    if (!pack) return;
    SoundService.playTearSound();
    HapticsService.packTearProgress(1.0);

    const newCards = openPack(pack);
    setPulledCards(newCards);
    setCurrentRevealIndex(0);
    setStage('REVEALING');

    if (newCards.length > 0) {
      revealCard(newCards[0]);
    }
  };

  const revealCard = (card: UserCard) => {
    SoundService.playCardReveal(card.player.rarity);
    HapticsService.triggerCardRevealHaptics(card.player.rarity);
  };

  const handleNextCard = () => {
    if (currentRevealIndex < pulledCards.length - 1) {
      const nextIndex = currentRevealIndex + 1;
      setCurrentRevealIndex(nextIndex);
      revealCard(pulledCards[nextIndex]);
    } else {
      setStage('SUMMARY');
      onCardsObtained(pulledCards);
    }
  };

  if (!visible || !pack) return null;

  const currentCard = pulledCards[currentRevealIndex];
  const currentRarityConfig = currentCard
    ? RARITY_COLORS[currentCard.player.rarity]
    : RARITY_COLORS.BRONZE;

  const shakeProgressPercent = Math.min(
    100,
    Math.round((shakeCount / REQUIRED_SHAKES) * 100)
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        {/* STAGE 1: SHAKE/TILT PHONE TO OPEN */}
        {stage === 'SHAKE_TO_OPEN' && (
          <View style={styles.contentContainer}>
            <Text style={styles.packHeading}>{pack.name}</Text>
            <Text style={styles.packDesc}>{pack.description}</Text>

            {/* Stylized Foil Pack in Motion */}
            <Animated.View
              style={[
                styles.packBodyContainer,
                {
                  transform: [{ translateX: wobbleAnim }],
                  backgroundColor: pack.themeColor,
                },
              ]}
            >
              {/* Foil Header */}
              <View style={styles.packTopBand}>
                <Text style={styles.packTopBandText}>
                  NBA TRADING CARDS
                </Text>
              </View>

              {/* Center NBA Logo PNG */}
              <View style={styles.packCenterEmblem}>
                <Image
                  source={require('../../../assets/nba-logo.png')}
                  style={styles.nbaLogoLarge}
                  resizeMode="contain"
                />
                <Text style={styles.packBadgeTitle}>{pack.badge}</Text>
                <Text style={styles.packCardCountText}>
                  {pack.cardCount} CARTAS OFICIALES
                </Text>
              </View>

              {/* Bottom Shake Energy Meter */}
              <View style={styles.meterContainer}>
                <View style={styles.meterTrack}>
                  <View
                    style={[
                      styles.meterFill,
                      { width: `${shakeProgressPercent}%` },
                    ]}
                  />
                </View>
                <Text style={styles.meterLabel}>
                  ENERGÍA DE APERTURA: {shakeCount} / {REQUIRED_SHAKES}
                </Text>
              </View>
            </Animated.View>

            {/* Instruction Card */}
            <View style={styles.shakeInstructionBox}>
              <Ionicons name="phone-portrait-outline" size={20} color="#0284C7" />
              <Text style={styles.shakeInstructionText}>
                Inclina o agita el teléfono a los lados para abrir
              </Text>
            </View>

            {/* Direct Tap Alternative */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => registerShake()}
              style={[styles.openTapBtn, { backgroundColor: pack.themeColor }]}
            >
              <Ionicons name="sparkles" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.openTapBtnText}>
                ¡TOCAR PARA ABRIR ({shakeCount}/{REQUIRED_SHAKES})!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STAGE 2: REVEALING CARDS ONE BY ONE */}
        {stage === 'REVEALING' && currentCard && (
          <View style={styles.revealBox}>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                CARTA {currentRevealIndex + 1} DE {pulledCards.length}
              </Text>
              <View
                style={[
                  styles.rarityBadgePill,
                  { backgroundColor: currentRarityConfig.badgeBg },
                ]}
              >
                <Text
                  style={[
                    styles.rarityBadgeText,
                    { color: currentRarityConfig.badgeText },
                  ]}
                >
                  {currentRarityConfig.label}
                </Text>
              </View>
            </View>

            {/* Tap card to open full attributes */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                HapticsService.selectionTick();
                setInspectedPlayer(currentCard.player);
              }}
              style={styles.cardWrapper}
            >
              <NBACard
                player={currentCard.player}
                size="lg"
                showDetailsOnFlip={true}
              />
              <View style={styles.touchHintPill}>
                <Ionicons name="information-circle-outline" size={12} color="#FFFFFF" />
                <Text style={styles.touchHintText}>Toca para ver atributos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNextCard}
              style={[
                styles.nextCardButton,
                {
                  backgroundColor:
                    currentRevealIndex === pulledCards.length - 1
                      ? '#16A34A'
                      : '#0284C7',
                },
              ]}
            >
              <Text style={styles.nextCardBtnText}>
                {currentRevealIndex === pulledCards.length - 1
                  ? 'VER RESUMEN DE SOBRE'
                  : 'SIGUIENTE CARTA'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* STAGE 3: SUMMARY */}
        {stage === 'SUMMARY' && (
          <View style={styles.summaryBox}>
            <View style={styles.summaryTitleRow}>
              <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
              <Text style={styles.summaryHeading}>¡Sobre Completado!</Text>
            </View>
            <Text style={styles.summaryDesc}>
              Toca cualquier carta para ver sus atributos completos.
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.summaryCardsScroll}
            >
              {pulledCards.map((card, index) => (
                <TouchableOpacity
                  key={card.instanceId || index}
                  activeOpacity={0.85}
                  onPress={() => {
                    HapticsService.selectionTick();
                    setInspectedPlayer(card.player);
                  }}
                  style={styles.summaryCardSlot}
                >
                  <NBACard player={card.player} size="md" width={140} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={[styles.nextCardButton, { backgroundColor: '#16A34A' }]}
            >
              <Text style={styles.nextCardBtnText}>GUARDAR Y CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Player Detail Attribute Modal */}
        <PlayerDetailModal
          visible={inspectedPlayer !== null}
          player={inspectedPlayer}
          onClose={() => setInspectedPlayer(null)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  packHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  packDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 16,
  },
  packBodyContainer: {
    width: 220,
    height: 310,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.7)',
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  packTopBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 5,
    borderRadius: 6,
  },
  packTopBandText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  packCenterEmblem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  nbaLogoLarge: {
    width: 65,
    height: 95,
  },
  packBadgeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  packCardCountText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  meterContainer: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  meterTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  meterLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  shakeInstructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shakeInstructionText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  openTapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    gap: 6,
  },
  openTapBtnText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelBtn: {
    marginTop: 10,
    padding: 6,
  },
  cancelBtnText: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  revealBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  rarityBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  rarityBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardWrapper: {
    marginVertical: 4,
    position: 'relative',
    alignItems: 'center',
  },
  touchHintPill: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  touchHintText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nextCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    marginTop: 12,
    gap: 6,
  },
  nextCardBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  summaryHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  summaryDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  summaryCardsScroll: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 10,
    alignItems: 'center',
  },
  summaryCardSlot: {
    width: 140,
    height: 224,
  },
});
