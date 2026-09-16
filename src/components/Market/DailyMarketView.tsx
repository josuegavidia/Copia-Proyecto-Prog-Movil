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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MarketItem, DailyMarketState, NBAPlayer, UserCard } from '../../types';
import { MarketService } from '../../services/market';
import { SoundService } from '../../services/sound';
import { HapticsService } from '../../services/haptics';
import { getPlayerDescription } from '../../utils/playerLore';
import { getPlayerFallbackHeadshotUrl, FALLBACK_HEADSHOT_URL } from '../../utils/imageUtils';
import { RARITY_COLORS } from '../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DailyMarketViewProps {
  coins: number;
  onBuyPlayer: (newCard: UserCard, cost: number) => Promise<void>;
}

type MarketFilter = 'ALL' | 'ICONS' | 'DIAMONDS' | 'DEALS';

const MarketPlayerImage: React.FC<{ player: NBAPlayer }> = ({ player }) => {
  const [src, setSrc] = useState(player.imageUrl);
  useEffect(() => {
    setSrc(player.imageUrl);
  }, [player.imageUrl]);

  return (
    <Image
      source={{ uri: src }}
      onError={() => {
        if (player.nbaPersonId) {
          const fallback260 = getPlayerFallbackHeadshotUrl(player.nbaPersonId);
          if (src !== fallback260 && src !== FALLBACK_HEADSHOT_URL) {
            setSrc(fallback260);
          } else if (src !== FALLBACK_HEADSHOT_URL) {
            setSrc(FALLBACK_HEADSHOT_URL);
          }
        } else if (src !== FALLBACK_HEADSHOT_URL) {
          setSrc(FALLBACK_HEADSHOT_URL);
        }
      }}
      style={styles.playerImg}
      resizeMode="contain"
    />
  );
};

export const DailyMarketView: React.FC<DailyMarketViewProps> = ({
  coins,
  onBuyPlayer,
}) => {
  const [marketState, setMarketState] = useState<DailyMarketState | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MarketFilter>('ALL');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [selectedPlayerForDetail, setSelectedPlayerForDetail] = useState<NBAPlayer | null>(null);
  const [modalImgUrl, setModalImgUrl] = useState<string>('');
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (selectedPlayerForDetail) {
      setModalImgUrl(selectedPlayerForDetail.imageUrl);
    }
  }, [selectedPlayerForDetail]);

  // Load Market on mount
  useEffect(() => {
    loadMarket();
  }, []);

  const loadMarket = async () => {
    setLoading(true);
    const data = await MarketService.getDailyMarket();
    setMarketState(data);
    setLoading(false);
  };

  // 24-Hour Live Countdown Timer
  useEffect(() => {
    if (!marketState || !marketState.expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = marketState.expiresAt - now;
      if (diff <= 0) {
        setSecondsRemaining(0);
        // Refresh market if expired
        loadMarket();
      } else {
        setSecondsRemaining(Math.floor(diff / 1000));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [marketState]);

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Buy action
  const handleBuy = async (item: MarketItem) => {
    if (item.isSold) return;

    if (coins < item.price) {
      HapticsService.selectionTick();
      Alert.alert(
        'Monedas Insuficientes',
        `Necesitas ${item.price.toLocaleString()} monedas para fichar a ${item.player.name}. ¡Juega partidos de temporada o el concurso de triples para ganar más monedas!`
      );
      return;
    }

    Alert.alert(
      'Confirmar Fichaje',
      `¿Deseas fichar a ${item.player.name} (${item.player.stats.ovr} OVR) por ${item.price.toLocaleString()} monedas?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Fichar Jugador',
          style: 'default',
          onPress: async () => {
            try {
              setIsBuying(true);
              HapticsService.celebrate();
              SoundService.playVictory();

              // Create UserCard instance
              const newCard = MarketService.createCardFromPlayer(item.player);

              // Update storage & market state
              const updatedState = await MarketService.buyMarketItem(item.id);
              if (updatedState) {
                setMarketState(updatedState);
              }

              // Deduct coins & add card to inventory
              await onBuyPlayer(newCard, item.price);
              setIsBuying(false);

              Alert.alert(
                '¡Fichaje Completado!',
                `Has incorporado a ${item.player.name} (${item.player.stats.ovr} OVR · ${item.player.rarity}) a tu colección y plantilla.`
              );
            } catch (e) {
              setIsBuying(false);
              console.error('Error buying player:', e);
            }
          },
        },
      ]
    );
  };

  if (loading || !marketState) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="basket" size={36} color="#1D428A" />
        <Text style={styles.loadingText}>Cargando Mercado Rotativo 24h...</Text>
      </View>
    );
  }

  // Filtered items
  const filteredItems = marketState.items.filter((item) => {
    if (filter === 'ICONS') return item.player.rarity === 'ICON' || item.player.isLegend;
    if (filter === 'DIAMONDS') return item.player.rarity === 'DIAMOND' || item.player.stats.ovr >= 94;
    if (filter === 'DEALS') return item.isDailyDeal;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* 24-HOUR ROTATION BANNER */}
      <View style={styles.rotationBanner}>
        <View style={styles.bannerLeft}>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveTagText}>MERCADO 24H</Text>
          </View>
          <Text style={styles.bannerTitle}>Fichajes & Traspasos</Text>
          <Text style={styles.bannerSub}>Ofertas exclusivas rotativas diarias</Text>
        </View>

        <View style={styles.timerBox}>
          <Ionicons name="time-outline" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
          <View>
            <Text style={styles.timerLabel}>PRÓXIMA ROTACIÓN</Text>
            <Text style={styles.timerValue}>{formatCountdown(secondsRemaining)}</Text>
          </View>
        </View>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setFilter('ALL');
          }}
          style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>
            Todos ({marketState.items.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setFilter('ICONS');
          }}
          style={[styles.filterChip, filter === 'ICONS' && styles.filterChipActiveIcon]}
        >
          <Ionicons name="sparkles" size={12} color={filter === 'ICONS' ? '#FFFFFF' : '#CA8A04'} style={{ marginRight: 4 }} />
          <Text style={[styles.filterText, filter === 'ICONS' && styles.filterTextActive]}>
            Iconos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setFilter('DIAMONDS');
          }}
          style={[styles.filterChip, filter === 'DIAMONDS' && styles.filterChipActiveDiamond]}
        >
          <Ionicons name="diamond" size={12} color={filter === 'DIAMONDS' ? '#FFFFFF' : '#0284C7'} style={{ marginRight: 4 }} />
          <Text style={[styles.filterText, filter === 'DIAMONDS' && styles.filterTextActive]}>
            Diamante
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            HapticsService.selectionTick();
            setFilter('DEALS');
          }}
          style={[styles.filterChip, filter === 'DEALS' && styles.filterChipActiveDeal]}
        >
          <Ionicons name="flame" size={12} color={filter === 'DEALS' ? '#FFFFFF' : '#DC2626'} style={{ marginRight: 4 }} />
          <Text style={[styles.filterText, filter === 'DEALS' && styles.filterTextActive]}>
            Ofertas
          </Text>
        </TouchableOpacity>
      </View>

      {/* MARKET ITEMS GRID */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.marketList}
      >
        <View style={styles.gridContainer}>
          {filteredItems.map((item) => {
            const isIcon = item.player.rarity === 'ICON' || item.player.isLegend;
            const rarityStyle = RARITY_COLORS[item.player.rarity] || RARITY_COLORS.BRONZE;
            const canAfford = coins >= item.price;

            return (
              <View
                key={item.id}
                style={[
                  styles.marketCard,
                  isIcon && styles.marketCardIcon,
                  item.isSold && styles.marketCardSold,
                ]}
              >
                {/* Daily Deal Badge */}
                {item.isDailyDeal && !item.isSold && (
                  <View style={styles.dailyDealBadge}>
                    <Ionicons name="flame" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
                    <Text style={styles.dailyDealText}>OFERTA -{item.discountPct}%</Text>
                  </View>
                )}

                {/* Icon Legend Badge */}
                {isIcon && !item.isDailyDeal && (
                  <View style={styles.iconBadgeTag}>
                    <Ionicons name="trophy" size={10} color="#92400E" style={{ marginRight: 3 }} />
                    <Text style={styles.iconBadgeText}>LEYENDA ICONO</Text>
                  </View>
                )}

                {/* Card Top: OVR, Position, Team */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlayerForDetail(item.player)}
                  style={styles.cardHeaderArea}
                >
                  <View style={styles.ovrBadge}>
                    <Text style={[styles.ovrText, { color: rarityStyle.border }]}>
                      {item.player.stats.ovr}
                    </Text>
                    <Text style={styles.ovrSub}>OVR</Text>
                  </View>

                  <MarketPlayerImage player={item.player} />

                  <View style={styles.posBadge}>
                    <Text style={styles.posText}>{item.player.position}</Text>
                    <Text style={styles.teamText}>{item.player.teamAbbr}</Text>
                  </View>
                </TouchableOpacity>

                {/* Player Name */}
                <Text numberOfLines={1} style={styles.playerName}>
                  {item.player.name}
                </Text>
                <Text style={styles.playerDetailsSub}>
                  {item.player.team} · {item.player.rarity}
                </Text>

                {/* Quick Attributes Row */}
                <View style={styles.miniStatsRow}>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniStatLabel}>3PT</Text>
                    <Text
                      style={[
                        styles.miniStatVal,
                        (item.player.stats.threePoint || 0) >= 90 && { color: '#DC2626', fontWeight: '900' },
                      ]}
                    >
                      {item.player.stats.threePoint || '-'}
                    </Text>
                  </View>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniStatLabel}>DNK</Text>
                    <Text style={styles.miniStatVal}>{item.player.stats.dunk || '-'}</Text>
                  </View>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniStatLabel}>DEF</Text>
                    <Text style={styles.miniStatVal}>{item.player.stats.defense || '-'}</Text>
                  </View>
                </View>

                {/* Price & Buy Button */}
                <View style={styles.priceContainer}>
                  {item.originalPrice && (
                    <Text style={styles.originalPriceText}>
                      {item.originalPrice.toLocaleString()} mon
                    </Text>
                  )}
                  <View style={styles.priceRow}>
                    <Ionicons name="cash" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
                    <Text style={styles.priceVal}>{item.price.toLocaleString()}</Text>
                    <Text style={styles.priceSub}>monedas</Text>
                  </View>
                </View>

                {item.isSold ? (
                  <View style={styles.soldBtn}>
                    <Ionicons name="checkmark-circle" size={15} color="#10B981" style={{ marginRight: 4 }} />
                    <Text style={styles.soldBtnText}>FICHADO</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={isBuying}
                    onPress={() => handleBuy(item)}
                    style={[
                      styles.buyBtn,
                      isIcon && styles.buyBtnIcon,
                      !canAfford && styles.buyBtnDisabled,
                    ]}
                  >
                    <Ionicons
                      name="cart"
                      size={15}
                      color={canAfford ? '#FFFFFF' : '#94A3B8'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.buyBtnText, !canAfford && styles.buyBtnTextDisabled]}>
                      {canAfford ? 'FICHAR' : 'SIN FONDOS'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* PLAYER STATS DETAIL MODAL */}
      {selectedPlayerForDetail && (
        <Modal
          visible={!!selectedPlayerForDetail}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedPlayerForDetail(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalPlayerName}>{selectedPlayerForDetail.name}</Text>
                  <Text style={styles.modalPlayerTeam}>
                    #{selectedPlayerForDetail.number} · {selectedPlayerForDetail.team} ({selectedPlayerForDetail.conference})
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedPlayerForDetail(null)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <View style={styles.modalHero}>
                  <Image
                    source={{ uri: modalImgUrl || selectedPlayerForDetail.imageUrl }}
                    onError={() => {
                      if (selectedPlayerForDetail.nbaPersonId) {
                        const fallback260 = getPlayerFallbackHeadshotUrl(selectedPlayerForDetail.nbaPersonId);
                        if (modalImgUrl !== fallback260 && modalImgUrl !== FALLBACK_HEADSHOT_URL) {
                          setModalImgUrl(fallback260);
                        } else if (modalImgUrl !== FALLBACK_HEADSHOT_URL) {
                          setModalImgUrl(FALLBACK_HEADSHOT_URL);
                        }
                      } else if (modalImgUrl !== FALLBACK_HEADSHOT_URL) {
                        setModalImgUrl(FALLBACK_HEADSHOT_URL);
                      }
                    }}
                    style={styles.modalHeroImg}
                    resizeMode="contain"
                  />
                  <View style={styles.modalHeroOvrBox}>
                    <Text style={styles.modalHeroOvrVal}>{selectedPlayerForDetail.stats.ovr}</Text>
                    <Text style={styles.modalHeroOvrLabel}>OVR</Text>
                    <View style={styles.modalRarityBadge}>
                      <Text style={styles.modalRarityText}>{selectedPlayerForDetail.rarity}</Text>
                    </View>
                  </View>
                </View>

                {/* Historical Lore / Season Context */}
                <View style={styles.modalLoreContainer}>
                  <View style={styles.modalLoreTitleRow}>
                    <Ionicons name="document-text-outline" size={13} color="#1E293B" style={{ marginRight: 4 }} />
                    <Text style={styles.modalLoreTitle}>MOMENTO & DESEMPEÑO DESTACADO</Text>
                  </View>
                  <Text style={styles.modalLoreText}>
                    {getPlayerDescription(selectedPlayerForDetail)}
                  </Text>
                </View>

                {/* Complete 8 Attributes */}
                <Text style={styles.attributesHeading}>ATRIBUTOS COMPLETOS NBA 2K</Text>
                <View style={styles.attributesGrid}>
                  <View style={styles.attrItem}>
                    <Text style={styles.attrLabel}>Tiro Triple (3PT)</Text>
                    <Text style={[styles.attrVal, selectedPlayerForDetail.stats.threePoint >= 90 && { color: '#DC2626' }]}>
                      {selectedPlayerForDetail.stats.threePoint}
                    </Text>
                  </View>
                  <View style={styles.attrItem}>
                    <Text style={styles.attrLabel}>Ataque General</Text>
                    <Text style={styles.attrVal}>{selectedPlayerForDetail.stats.offense}</Text>
                  </View>
                  <View style={styles.attrItem}>
                    <Text style={styles.attrLabel}>Defensa</Text>
                    <Text style={styles.attrVal}>{selectedPlayerForDetail.stats.defense}</Text>
                  </View>
                  <View style={styles.attrItem}>
                    <Text style={styles.attrLabel}>Clavada (Dunk)</Text>
                    <Text style={styles.attrVal}>{selectedPlayerForDetail.stats.dunk}</Text>
                  </View>
                  <View style={styles.attrItem}>
                    <Text style={styles.attrLabel}>Creación (Playmaking)</Text>
                    <Text style={styles.attrVal}>{selectedPlayerForDetail.stats.playmaking}</Text>
                  </View>
                  <View style={styles.attrItem}>
                    <Text style={styles.attrLabel}>Rebote</Text>
                    <Text style={styles.attrVal}>{selectedPlayerForDetail.stats.rebound}</Text>
                  </View>
                  <View style={styles.attrItem}>
                    <Text style={styles.attrLabel}>Velocidad</Text>
                    <Text style={styles.attrVal}>{selectedPlayerForDetail.stats.speed}</Text>
                  </View>
                  <View style={styles.attrItem}>
                    <Text style={styles.attrLabel}>Posición</Text>
                    <Text style={styles.attrVal}>{selectedPlayerForDetail.position}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedPlayerForDetail(null)}
                  style={styles.modalDoneBtn}
                >
                  <Text style={styles.modalDoneBtnText}>CERRAR VISTA PREVIA</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },

  // 24H BANNER
  rotationBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
  },
  bannerLeft: {
    flex: 1,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveTagText: {
    color: '#F87171',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  bannerSub: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timerLabel: {
    color: '#94A3B8',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  timerValue: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // FILTER TABS
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#1D428A',
    borderColor: '#1D428A',
  },
  filterChipActiveIcon: {
    backgroundColor: '#CA8A04',
    borderColor: '#CA8A04',
  },
  filterChipActiveDiamond: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  filterChipActiveDeal: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  // GRID LIST
  marketList: {
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  marketCard: {
    width: (SCREEN_WIDTH - 36) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  marketCardIcon: {
    borderColor: '#FDE047',
    borderWidth: 1.5,
    backgroundColor: '#FFFFFA',
  },
  marketCardSold: {
    opacity: 0.6,
  },
  dailyDealBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },
  dailyDealText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  iconBadgeTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FEF08A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 10,
  },
  iconBadgeText: {
    color: '#854D0E',
    fontSize: 8,
    fontWeight: '800',
  },
  cardHeaderArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  ovrBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovrText: {
    fontSize: 20,
    fontWeight: '900',
  },
  ovrSub: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    marginTop: -2,
  },
  playerImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
  },
  posBadge: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  posText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  teamText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#64748B',
  },
  playerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  playerDetailsSub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94A3B8',
  },
  miniStatVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPriceText: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  priceSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 3,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D428A',
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyBtnIcon: {
    backgroundColor: '#CA8A04',
  },
  buyBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  buyBtnTextDisabled: {
    color: '#94A3B8',
  },
  soldBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  soldBtnText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '800',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalPlayerName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalPlayerTeam: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  modalHeroImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 14,
  },
  modalHeroOvrBox: {
    alignItems: 'flex-start',
  },
  modalHeroOvrVal: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalHeroOvrLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginTop: -4,
  },
  modalRarityBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  modalRarityText: {
    color: '#854D0E',
    fontSize: 9,
    fontWeight: '800',
  },
  modalScroll: {
    maxHeight: 520,
  },
  modalLoreContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 12,
  },
  modalLoreTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalLoreTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.3,
  },
  modalLoreText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  attributesHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  attrItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  attrLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  attrVal: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '800',
  },
  modalDoneBtn: {
    backgroundColor: '#1D428A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
