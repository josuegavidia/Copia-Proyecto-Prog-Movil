import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { PackDefinition, UserCard } from '../types';
import { PACK_DEFINITIONS } from '../data/packs';
import { PackOpeningModal } from '../components/Pack/PackOpeningModal';
import { DailyMarketView } from '../components/Market/DailyMarketView';
import { StorageService } from '../services/storage';
import { HapticsService } from '../services/haptics';
import { THEME } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addCards, spendCoins } from '../store/slices/squadSlice';

const FREE_PACK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface PacksScreenProps {
  coins?: number;
  onPacksOpened?: (newCards: UserCard[], cost: number) => void;
}

export const PacksScreen: React.FC<PacksScreenProps> = ({
  coins: propsCoins,
  onPacksOpened,
}) => {
  const dispatch = useAppDispatch();
  const reduxCoins = useAppSelector((state) => state.squad.coins);
  const coins = propsCoins !== undefined ? propsCoins : reduxCoins;

  const [storeTab, setStoreTab] = useState<'PACKS' | 'MARKET'>('PACKS');
  const [selectedPack, setSelectedPack] = useState<PackDefinition | null>(null);
  const [openingCost, setOpeningCost] = useState<number>(0);
  const [isOpeningModalVisible, setIsOpeningModalVisible] = useState(false);

  // Free pack cooldown state (5 minutes)
  const [lastFreePackTime, setLastFreePackTime] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    const loadFreePackState = async () => {
      const storedTime = await StorageService.getLastFreePackTime();
      setLastFreePackTime(storedTime);
    };
    loadFreePackState();
  }, []);

  useEffect(() => {
    const checkTimer = () => {
      const now = Date.now();
      const elapsed = now - lastFreePackTime;
      if (elapsed >= FREE_PACK_INTERVAL_MS) {
        setSecondsRemaining(0);
      } else {
        const remaining = Math.max(0, Math.ceil((FREE_PACK_INTERVAL_MS - elapsed) / 1000));
        setSecondsRemaining(remaining);
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [lastFreePackTime]);

  const isFreeBronzeAvailable = secondsRemaining === 0;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenFreeBronze = async (bronzePack: PackDefinition) => {
    await HapticsService.selectionTick();
    const now = Date.now();
    await StorageService.setLastFreePackTime(now);
    setLastFreePackTime(now);
    setSelectedPack(bronzePack);
    setOpeningCost(0);
    setIsOpeningModalVisible(true);
  };

  const handleBuyPack = async (pack: PackDefinition) => {
    if (coins < pack.cost) {
      await HapticsService.selectionTick();
      Alert.alert(
        'Monedas Insuficientes',
        `Necesitas ${pack.cost} monedas para este sobre. Puedes ganar monedas jugando partidos o reciclando duplicados en Colección.`
      );
      return;
    }

    await HapticsService.selectionTick();
    setSelectedPack(pack);
    setOpeningCost(pack.cost);
    setIsOpeningModalVisible(true);
  };

  const handleCardsObtained = async (newCards: UserCard[]) => {
    if (selectedPack) {
      if (onPacksOpened) {
        onPacksOpened(newCards, openingCost);
      } else {
        await dispatch(addCards(newCards));
        if (openingCost > 0) {
          await dispatch(spendCoins(openingCost));
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Coins Bar */}
      <View style={styles.topHud}>
        <View style={styles.coinsCounter}>
          <Ionicons name="cash-outline" size={20} color="#CA8A04" />
          <Text style={styles.coinsValue}>{coins.toLocaleString()}</Text>
          <Text style={styles.coinsLabel}>Monedas</Text>
        </View>

        {/* Free Bronze Pack Status Pill */}
        <View
          style={[
            styles.freeTimerPill,
            isFreeBronzeAvailable ? styles.freeTimerPillReady : styles.freeTimerPillWaiting,
          ]}
        >
          {isFreeBronzeAvailable ? (
            <>
              <Ionicons name="gift-outline" size={13} color="#FFFFFF" />
              <Text style={styles.freeTimerPillReadyText}>1 Sobre Gratis Listo</Text>
            </>
          ) : (
            <>
              <Ionicons name="time-outline" size={13} color="#64748B" />
              <Text style={styles.freeTimerPillWaitingText}>
                Gratis en {formatTimer(secondsRemaining)}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* STORE SUB-TABS: PACKS VS DAILY ROTATING MARKET */}
      <View style={styles.storeTabsRow}>
        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setStoreTab('PACKS');
          }}
          style={[styles.storeTabBtn, storeTab === 'PACKS' && styles.storeTabBtnActive]}
        >
          <Ionicons
            name="cube"
            size={15}
            color={storeTab === 'PACKS' ? '#FFFFFF' : '#64748B'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.storeTabBtnText, storeTab === 'PACKS' && styles.storeTabBtnTextActive]}>
            Sobres Oficiales
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setStoreTab('MARKET');
          }}
          style={[styles.storeTabBtn, storeTab === 'MARKET' && styles.storeTabBtnActiveMarket]}
        >
          <Ionicons
            name="basket"
            size={15}
            color={storeTab === 'MARKET' ? '#FFFFFF' : '#DC2626'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.storeTabBtnText, storeTab === 'MARKET' && styles.storeTabBtnTextActive]}>
            Mercado 24h
          </Text>
        </TouchableOpacity>
      </View>

      {storeTab === 'MARKET' ? (
        <DailyMarketView
          coins={coins}
          onBuyPlayer={async (newCard, cost) => {
            if (onPacksOpened) {
              onPacksOpened([newCard], cost);
            } else {
              await dispatch(addCards([newCard]));
              if (cost > 0) {
                await dispatch(spendCoins(cost));
              }
            }
          }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionHeader}>TIENDA OFICIAL DE SOBRES NBA</Text>
          <Text style={styles.sectionSub}>
            Colecciona las estrellas de la NBA para potenciar tu quinteto titular
          </Text>

        {/* Packs Grid */}
        <View style={styles.packsGrid}>
          {PACK_DEFINITIONS.map((pack) => {
            const canAfford = coins >= pack.cost;
            const isBronze = pack.id === 'pack-bronze';

            return (
              <View
                key={pack.id}
                style={[
                  styles.packCard,
                  { borderColor: pack.themeColor },
                ]}
              >
                {/* Pack Visual Artistic Foil Front (Clean - No emojis, only NBA logo) */}
                <View
                  style={[
                    styles.packVisualBox,
                    { backgroundColor: pack.themeColor },
                  ]}
                >
                  {/* Foil Header Line */}
                  <View style={styles.foilTopLine}>
                    <Text style={styles.foilTopText}>NBA OFFICIAL</Text>
                  </View>

                  {/* Center Official NBA Logo PNG */}
                  <View style={styles.packCenterLogoBox}>
                    <Image
                      source={require('../../assets/nba-logo.png')}
                      style={styles.nbaLogoPack}
                      resizeMode="contain"
                    />
                  </View>

                  {/* Quality Badge */}
                  <View style={styles.packBadgePill}>
                    <Text style={[styles.packBadgePillText, { color: pack.themeColor }]}>
                      {pack.badge}
                    </Text>
                  </View>

                  {/* Bottom Strip */}
                  <View style={styles.foilBottomLine}>
                    <Text style={styles.cardCountTag}>{pack.cardCount} CARTAS</Text>
                  </View>
                </View>

                {/* Pack Details */}
                <View style={styles.packInfo}>
                  <View>
                    <Text style={styles.packName}>{pack.name}</Text>
                    <Text style={styles.packDesc}>{pack.description}</Text>
                  </View>

                  {/* Buttons Section */}
                  <View style={styles.buttonsWrap}>
                    {/* If Bronze and Free is available */}
                    {isBronze && (
                      <View style={styles.bronzeActionGroup}>
                        {isFreeBronzeAvailable ? (
                          <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => handleOpenFreeBronze(pack)}
                            style={styles.freeBronzeBtn}
                          >
                            <Ionicons name="gift-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                            <Text style={styles.freeBronzeBtnText}>ABRIR GRATIS</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.timerTag}>
                            <Ionicons name="time-outline" size={11} color="#64748B" style={{ marginRight: 4 }} />
                            <Text style={styles.timerTagText}>
                              Gratis en {formatTimer(secondsRemaining)}
                            </Text>
                          </View>
                        )}

                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => handleBuyPack(pack)}
                          style={[
                            styles.buyButtonSmall,
                            {
                              backgroundColor: canAfford ? pack.themeColor : '#94A3B8',
                            },
                          ]}
                        >
                          <Ionicons name="cash-outline" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                          <Text style={styles.buyButtonSmallText}>
                            {pack.cost}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Standard Pack Buy Button (For Silver, Gold, Diamond) */}
                    {!isBronze && (
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => handleBuyPack(pack)}
                        style={[
                          styles.buyButton,
                          {
                            backgroundColor: canAfford ? pack.themeColor : '#94A3B8',
                          },
                        ]}
                      >
                        <Ionicons name="cash-outline" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.buyButtonText}>
                          ABRIR · {pack.cost}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      )}

      {/* Shake to Open Modal */}
      <PackOpeningModal
        visible={isOpeningModalVisible}
        pack={selectedPack}
        onClose={() => setIsOpeningModalVisible(false)}
        onCardsObtained={handleCardsObtained}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  storeTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  storeTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  storeTabBtnActive: {
    backgroundColor: '#1D428A',
  },
  storeTabBtnActiveMarket: {
    backgroundColor: '#DC2626',
  },
  storeTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  storeTabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  coinsCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  coinsLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  freeTimerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 5,
  },
  freeTimerPillReady: {
    backgroundColor: '#16A34A',
  },
  freeTimerPillWaiting: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  freeTimerPillReadyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  freeTimerPillWaitingText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 16,
  },
  packsGrid: {
    gap: 14,
  },
  packCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 10,
    gap: 12,
    alignItems: 'center',
  },
  packVisualBox: {
    width: 110,
    height: 150,
    borderRadius: 8,
    padding: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  foilTopLine: {
    alignItems: 'center',
  },
  foilTopText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  packCenterLogoBox: {
    width: 50,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nbaLogoPack: {
    width: 44,
    height: 60,
  },
  packBadgePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  packBadgePillText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  foilBottomLine: {
    width: '100%',
    alignItems: 'center',
  },
  cardCountTag: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  packInfo: {
    flex: 1,
    justifyContent: 'space-between',
    height: 150,
    paddingVertical: 2,
  },
  packName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  packDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
  },
  buttonsWrap: {
    marginTop: 6,
  },
  bronzeActionGroup: {
    gap: 6,
  },
  freeBronzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 7,
    borderRadius: 6,
    gap: 5,
  },
  freeBronzeBtnText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    borderRadius: 5,
    gap: 4,
  },
  timerTagText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  buyButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  buyButtonSmallText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  buyButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
