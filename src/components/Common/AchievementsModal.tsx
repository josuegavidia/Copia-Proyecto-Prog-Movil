import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { claimAchievementReward } from '../../store/slices/squadSlice';
import { evaluateAchievements, AchievementCategory, AchievementProgress } from '../../data/achievements';
import { useTranslation } from '../../i18n/useTranslation';
import { HapticsService } from '../../services/haptics';
import { SoundService } from '../../services/sound';
import { NBA_THEME } from '../../theme/colors';
import { CustomBadge } from './CustomBadge';
import { useTheme } from '../../context/ThemeContext';

interface AchievementsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { t, language } = useTranslation();

  const cards = useAppSelector((state) => state.squad.cards);
  const coins = useAppSelector((state) => state.squad.coins);
  const claimedAchievements = useAppSelector((state) => state.squad.claimedAchievements);
  const careerStats = useAppSelector((state) => state.squad.careerStats);

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('ALL');

  // Compute live progress
  const achievements = evaluateAchievements(
    cards,
    coins,
    careerStats,
    claimedAchievements
  );

  const totalCount = achievements.length;
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const claimedCount = achievements.filter((a) => a.isClaimed).length;
  const readyToClaimCount = achievements.filter((a) => a.isUnlocked && !a.isClaimed).length;
  const overallProgressPct = Math.round((unlockedCount / totalCount) * 100);

  const filteredList = achievements.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.definition.category === selectedCategory;
  });

  const handleClaim = async (item: AchievementProgress) => {
    if (!item.isUnlocked || item.isClaimed) return;

    await HapticsService.celebrate();
    SoundService.playMoneyBall();

    await dispatch(
      claimAchievementReward({
        id: item.id,
        rewardCoins: item.definition.rewardCoins,
      })
    );

    Alert.alert(
      t.achievements.congratulations,
      t.achievements.rewardEarned.replace('{coins}', item.definition.rewardCoins.toLocaleString())
    );
  };

  const renderCategoryTab = (cat: AchievementCategory, label: string) => {
    const isSelected = selectedCategory === cat;
    return (
      <TouchableOpacity
        key={cat}
        style={[
          styles.categoryTab,
          { backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9' },
          isSelected && styles.categoryTabActive,
        ]}
        onPress={async () => {
          await HapticsService.selectionTick();
          setSelectedCategory(cat);
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.categoryTabText,
            { color: isDark ? colors.textMuted : '#64748B' },
            isSelected && styles.categoryTabTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAchievementItem = ({ item }: { item: AchievementProgress }) => {
    const title = item.definition.title[language] || item.definition.title.es;
    const description = item.definition.description[language] || item.definition.description.es;
    const canClaim = item.isUnlocked && !item.isClaimed;

    const cardBg = isDark
      ? (item.isUnlocked ? '#1E293B' : '#141B29')
      : (item.isUnlocked ? '#FFFDF7' : '#FFFFFF');

    const cardBorder = isDark
      ? (item.isUnlocked ? (item.isClaimed ? '#334155' : '#D97706') : '#1E293B')
      : (item.isUnlocked ? (item.isClaimed ? '#E2E8F0' : '#FDE68A') : '#E2E8F0');

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
          },
          item.isClaimed && { opacity: 0.85 },
        ]}
      >
        {/* Top Info Row */}
        <View style={styles.cardHeaderRow}>
          {/* Icon Circle */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: item.isUnlocked ? `${item.definition.iconColor}20` : (isDark ? '#0F172A' : '#F1F5F9') },
            ]}
          >
            <Ionicons
              name={item.definition.iconName as any}
              size={22}
              color={item.isUnlocked ? item.definition.iconColor : colors.textMuted}
            />
          </View>

          {/* Title & Badge */}
          <View style={styles.cardTitleBox}>
            <View style={styles.cardTopBadgeRow}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              {item.definition.badgeText && (
                <CustomBadge
                  label={item.definition.badgeText}
                  variant={item.isUnlocked ? 'navy' : 'neutral'}
                  size="sm"
                />
              )}
            </View>

            <Text style={[styles.cardDescription, { color: colors.textMuted }]} numberOfLines={2}>
              {description}
            </Text>
          </View>
        </View>

        {/* Progress Bar Row */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBarBackground, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${item.progressPct}%`,
                  backgroundColor: item.isClaimed
                    ? '#10B981'
                    : item.isUnlocked
                    ? '#F59E0B'
                    : '#0284C7',
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textMuted }]}>
            {item.current} / {item.target} ({item.progressPct}%)
          </Text>
        </View>

        {/* Action / Status Footer */}
        <View style={styles.cardFooter}>
          {/* Reward Amount Info */}
          <View style={[styles.rewardBadge, { backgroundColor: isDark ? '#78350F33' : '#FEF3C7' }]}>
            <Ionicons name="cash-outline" size={14} color="#D97706" />
            <Text style={[styles.rewardText, { color: isDark ? '#FDE047' : '#D97706' }]}>
              +{item.definition.rewardCoins.toLocaleString()} {t.common.coins}
            </Text>
          </View>

          {/* Button or Status */}
          {canClaim ? (
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => handleClaim(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="gift-outline" size={15} color="#FFFFFF" />
              <Text style={styles.claimButtonText}>{t.achievements.claimReward}</Text>
            </TouchableOpacity>
          ) : item.isClaimed ? (
            <View style={styles.claimedBadge}>
              <Ionicons name="checkmark-circle" size={15} color="#10B981" />
              <Text style={styles.claimedText}>{t.achievements.rewardClaimed}</Text>
            </View>
          ) : (
            <View style={[styles.lockedBadge, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
              <Ionicons name="lock-closed-outline" size={13} color={colors.textMuted} />
              <Text style={[styles.lockedText, { color: colors.textMuted }]}>{t.common.locked}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.bg, paddingTop: Math.max(insets.top, 16) }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.trophyIconBox, isDark && { backgroundColor: '#78350F33', borderColor: '#B45309' }]}>
                <Ionicons name="trophy" size={20} color="#F59E0B" />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t.achievements.modalTitle}</Text>
                <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                  {unlockedCount} / {totalCount} {t.achievements.unlockedTrophies}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={28} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Overall Progress Banner */}
          <View style={[styles.overallBanner, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <View style={styles.bannerTopRow}>
              <Text style={[styles.bannerLabel, { color: colors.textMuted }]}>{t.achievements.progressSummary}</Text>
              <Text style={[styles.bannerPct, { color: colors.text }]}>{overallProgressPct}%</Text>
            </View>
            <View style={[styles.bannerBarBg, { backgroundColor: isDark ? '#0F172A' : '#E2E8F0' }]}>
              <View
                style={[
                  styles.bannerBarFill,
                  { width: `${overallProgressPct}%` },
                ]}
              />
            </View>
            {readyToClaimCount > 0 && (
              <View style={[styles.readyNotice, { backgroundColor: isDark ? '#78350F33' : '#FEF3C7', borderColor: '#F59E0B' }]}>
                <Ionicons name="notifications-outline" size={14} color="#D97706" />
                <Text style={[styles.readyNoticeText, { color: isDark ? '#FDE047' : '#D97706' }]}>
                  {readyToClaimCount} {t.achievements.modalTitle.toLowerCase()} {t.common.unlocked.toLowerCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Categories Selector */}
          <View style={[styles.categoriesBar, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
            {renderCategoryTab('ALL', t.achievements.allTab)}
            {renderCategoryTab('TEAMS', t.achievements.teamsTab)}
            {renderCategoryTab('COLLECTION', t.achievements.collectionTab)}
            {renderCategoryTab('CAREER', t.achievements.careerTab)}
            {renderCategoryTab('GAMEPLAY', t.achievements.gameplayTab)}
          </View>

          {/* Achievements List */}
          <FlatList
            data={filteredList}
            keyExtractor={(item) => item.id}
            renderItem={renderAchievementItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  closeBtn: {
    padding: 2,
  },
  overallBanner: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bannerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  bannerPct: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  bannerBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bannerBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  readyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  readyNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  categoriesBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  categoryTabActive: {
    backgroundColor: NBA_THEME.nbaNavy,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardUnlocked: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFDF7',
  },
  cardClaimed: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleBox: {
    flex: 1,
  },
  cardTopBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  cardTitleUnlocked: {
    color: '#0F172A',
  },
  cardTitleLocked: {
    color: '#64748B',
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  progressContainer: {
    marginTop: 12,
    gap: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 5,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  claimedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  lockedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
