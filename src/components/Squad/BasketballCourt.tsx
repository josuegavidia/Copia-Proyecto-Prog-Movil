import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SquadLineup, Position, UserCard, CustomCoach } from '../../types';
import { NBACard } from '../Card/NBACard';
import { CustomCoachCard } from '../Card/CustomCoachCard';
import { THEME } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COURT_WIDTH = Math.min(SCREEN_WIDTH - 24, 400);

interface BasketballCourtProps {
  lineup: SquadLineup;
  onSlotPress: (position: Position) => void;
  onPlayerPress: (card: UserCard, position: Position) => void;
  onCoachPress: () => void;
}

export const BasketballCourt: React.FC<BasketballCourtProps> = ({
  lineup,
  onSlotPress,
  onPlayerPress,
  onCoachPress,
}) => {
  const renderSlot = (pos: Position, card: UserCard | null) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          if (card) {
            onPlayerPress(card, pos);
          } else {
            onSlotPress(pos);
          }
        }}
        style={styles.slotButton}
      >
        {card ? (
          <View style={styles.cardWrapper} pointerEvents="none">
            <NBACard player={card.player} size="sm" />
          </View>
        ) : (
          <View style={styles.emptySlot}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="add" size={18} color="#FDB927" />
            </View>
            <Text style={styles.emptyPosText}>{pos}</Text>
            <Text style={styles.emptyAddText}>Elegir</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.courtContainer}>
      <View style={styles.courtSurface}>
        {/* Parquet Hardwood Floor Wood Texture Lines */}
        <View style={styles.parquetLine1} />
        <View style={styles.parquetLine2} />
        <View style={styles.parquetLine3} />
        <View style={styles.parquetLine4} />

        {/* Center Court Jump Circle (Lakers Purple & Gold) */}
        <View style={styles.centerCircle}>
          <View style={styles.centerInnerCircle}>
            <Text style={styles.centerText}>LAKERS</Text>
          </View>
        </View>

        {/* 3-Point Line (Arc + Corner Lines in Lakers Purple) */}
        <View style={styles.threePointLine} />
        <View style={styles.cornerThreeLeft} />
        <View style={styles.cornerThreeRight} />

        {/* The Paint / Key Area (Morado Oficial Lakers #552583 + Bordes Oro #FDB927) */}
        <View style={styles.keyPaintArea}>
          {/* Free Throw Circle Top */}
          <View style={styles.freeThrowCircleTop} />
          
          {/* Key Lane Notches */}
          <View style={styles.keyNotchLeft1} />
          <View style={styles.keyNotchLeft2} />
          <View style={styles.keyNotchRight1} />
          <View style={styles.keyNotchRight2} />

          {/* Restricted Area Arc */}
          <View style={styles.restrictedAreaArc} />

          {/* Backboard & Orange Basketball Hoop */}
          <View style={styles.backboard} />
          <View style={styles.basketHoop}>
            <View style={styles.basketNet} />
          </View>
        </View>

        {/* 5 Starting Player Slots */}
        <View style={styles.courtGrid}>
          {/* Top: PG (Point Guard) */}
          <View style={styles.topRow}>
            <View style={styles.slotContainer}>
              <View style={styles.posLabelBadge}>
                <Text style={styles.posLabelText}>BASE (PG)</Text>
              </View>
              {renderSlot('PG', lineup.pg)}
            </View>
          </View>

          {/* Wings: SF and SG */}
          <View style={styles.wingsRow}>
            <View style={styles.slotContainer}>
              <View style={styles.posLabelBadge}>
                <Text style={styles.posLabelText}>ALERO (SF)</Text>
              </View>
              {renderSlot('SF', lineup.sf)}
            </View>

            <View style={styles.slotContainer}>
              <View style={styles.posLabelBadge}>
                <Text style={styles.posLabelText}>ESCOLTA (SG)</Text>
              </View>
              {renderSlot('SG', lineup.sg)}
            </View>
          </View>

          {/* Paint: C and PF */}
          <View style={styles.paintRow}>
            <View style={styles.slotContainer}>
              <View style={styles.posLabelBadge}>
                <Text style={styles.posLabelText}>PÍVOT (C)</Text>
              </View>
              {renderSlot('C', lineup.c)}
            </View>

            <View style={styles.slotContainer}>
              <View style={styles.posLabelBadge}>
                <Text style={styles.posLabelText}>ALA-PÍVOT (PF)</Text>
              </View>
              {renderSlot('PF', lineup.pf)}
            </View>
          </View>
        </View>
      </View>

      {/* Head Coach / Banquillo Section (Full Player-Sized Card) */}
      <View style={styles.coachSection}>
        <View style={styles.coachHeaderRow}>
          <View style={styles.coachTitleWrap}>
            <Text style={styles.coachTitle}>BANQUILLO Y DIRECCIÓN TÉCNICA</Text>
            {lineup.coach ? (
              <View style={styles.coachDetailBadgesRow}>
                <View style={styles.tacticBadgePill}>
                  <Text style={styles.tacticBadgeText}>Filosofía: {lineup.coach.tactic}</Text>
                </View>
                <View style={styles.boostBadgePill}>
                  <Text style={styles.boostBadgeText}>
                    +{lineup.coach.boostOffense} OFF · +{lineup.coach.boostDefense} DEF · +{lineup.coach.boostChemistry}% QUÍM
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.coachSubtitle}>
                Toca para crear tu carta de DT oficial con selfie
              </Text>
            )}
          </View>
        </View>

        <View style={styles.coachCardCenter}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onCoachPress}
            style={styles.coachSlotButton}
          >
            {lineup.coach ? (
              <View pointerEvents="none">
                <CustomCoachCard coach={lineup.coach} size="sm" />
              </View>
            ) : (
              <View style={styles.emptyCoachSlot}>
                <View style={styles.emptyCoachIcon}>
                  <Ionicons name="person-outline" size={24} color="#CA8A04" />
                </View>
                <Text style={styles.emptyCoachText}>SIN ENTRENADOR ASIGNADO</Text>
                <Text style={styles.emptyCoachSubText}>Toca para crear DT o asignar táctica</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  courtContainer: {
    width: COURT_WIDTH,
    alignSelf: 'center',
    marginBottom: 16,
  },
  courtSurface: {
    width: '100%',
    minHeight: 530,
    borderRadius: 18,
    borderWidth: 3.5,
    borderColor: '#552583', // Lakers Royal Purple outer perimeter
    backgroundColor: '#DFC3A2', // Blonde natural maple hardwood floor
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  // Parquet Wood Grains (Subtle planks lines)
  parquetLine1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  parquetLine2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  parquetLine3: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '75%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  parquetLine4: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '30%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },

  // Center Court Jump Circle (Lakers Purple & Gold)
  centerCircle: {
    position: 'absolute',
    top: -45,
    left: '50%',
    marginLeft: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: '#552583',
    backgroundColor: 'rgba(253, 185, 39, 0.2)', // Lakers Gold translucent ring
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  centerInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FDB927', // Lakers Gold
    backgroundColor: '#552583', // Lakers Purple
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FDB927',
    letterSpacing: 1,
  },

  // 3-Point Arc (Lakers Purple)
  threePointLine: {
    position: 'absolute',
    bottom: -60,
    left: '50%',
    marginLeft: -155,
    width: 310,
    height: 380,
    borderRadius: 155,
    borderWidth: 2.5,
    borderColor: '#552583',
  },
  cornerThreeLeft: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    width: 2.5,
    height: 120,
    backgroundColor: '#552583',
  },
  cornerThreeRight: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    width: 2.5,
    height: 120,
    backgroundColor: '#552583',
  },

  // The Paint / Key Area (Morado Oficial Lakers #552583 + Bordes Oro #FDB927)
  keyPaintArea: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -65,
    width: 130,
    height: 165,
    backgroundColor: '#552583', // Iconic Lakers Purple (No blue, full contrast with Diamond cards)
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FDB927', // Lakers Vivid Gold border
    alignItems: 'center',
  },
  freeThrowCircleTop: {
    position: 'absolute',
    top: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: '#FDB927',
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  keyNotchLeft1: {
    position: 'absolute',
    left: -5,
    top: 40,
    width: 5,
    height: 4,
    backgroundColor: '#FDB927',
  },
  keyNotchLeft2: {
    position: 'absolute',
    left: -5,
    top: 80,
    width: 5,
    height: 4,
    backgroundColor: '#FDB927',
  },
  keyNotchRight1: {
    position: 'absolute',
    right: -5,
    top: 40,
    width: 5,
    height: 4,
    backgroundColor: '#FDB927',
  },
  keyNotchRight2: {
    position: 'absolute',
    right: -5,
    top: 80,
    width: 5,
    height: 4,
    backgroundColor: '#FDB927',
  },
  restrictedAreaArc: {
    position: 'absolute',
    bottom: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  backboard: {
    position: 'absolute',
    bottom: 8,
    width: 36,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  basketHoop: {
    position: 'absolute',
    bottom: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EA580C', // NBA Regulation Orange Rim
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketNet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  courtGrid: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 5,
  },
  topRow: {
    alignItems: 'center',
    marginBottom: 6,
  },
  wingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  paintRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
  },
  slotContainer: {
    alignItems: 'center',
  },
  posLabelBadge: {
    backgroundColor: 'rgba(85, 37, 131, 0.95)', // Lakers Purple badge
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FDB927', // Lakers Gold border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  posLabelText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  slotButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  emptySlot: {
    width: 104,
    height: 148,
    backgroundColor: 'rgba(85, 37, 131, 0.25)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FDB927',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#552583',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPosText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#552583',
  },
  emptyAddText: {
    fontSize: 10,
    color: '#FDB927',
    fontWeight: '700',
  },

  // Coach Section (Below Court)
  coachSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  coachHeaderRow: {
    marginBottom: 10,
  },
  coachTitleWrap: {
    alignItems: 'center',
  },
  coachTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  coachSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
  },
  coachDetailBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  tacticBadgePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tacticBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  boostBadgePill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  boostBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#15803D',
  },
  coachCardCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  coachSlotButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCoachSlot: {
    width: 104,
    height: 148,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyCoachIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#552583',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyCoachText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#552583',
    textAlign: 'center',
  },
  emptyCoachSubText: {
    fontSize: 8.5,
    color: '#64748B',
    textAlign: 'center',
  },
});
