import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SyncService, SyncStatus } from '../../services/sync';
import { AuthService, ManagerProfile } from '../../services/auth';
import { HapticsService } from '../../services/haptics';
import { NBA_THEME } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setAchievementsModalVisible } from '../../store/slices/squadSlice';
import { evaluateAchievements } from '../../data/achievements';
import { useTranslation } from '../../i18n/useTranslation';

interface ManagerHeaderProps {
  coins: number;
  onOpenProfile: () => void;
}

export const ManagerHeader: React.FC<ManagerHeaderProps> = ({
  coins,
  onOpenProfile,
}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();

  const cards = useAppSelector((state) => state.squad.cards);
  const claimedAchievements = useAppSelector((state) => state.squad.claimedAchievements);
  const careerStats = useAppSelector((state) => state.squad.careerStats);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncService.getStatus());
  const [profile, setProfile] = useState<ManagerProfile>({
    id: 'guest',
    username: t.header.rookieManager,
    coins,
    total_packs_opened: 0,
  });

  // Calculate un-claimed achievements ready to claim
  const achievements = evaluateAchievements(
    cards,
    coins,
    careerStats,
    claimedAchievements
  );
  const unclaimedCount = achievements.filter((a) => a.isUnlocked && !a.isClaimed).length;

  useEffect(() => {
    const unsubscribe = SyncService.subscribe((status) => {
      setSyncStatus(status);
    });

    AuthService.getProfile().then(setProfile);

    return () => {
      unsubscribe();
    };
  }, []);

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'SYNCING':
        return <ActivityIndicator size={12} color={colors.primary} />;
      case 'SYNCED':
        return <Ionicons name="cloud-done" size={14} color="#10B981" />;
      case 'ERROR':
        return <Ionicons name="alert-circle" size={14} color="#EF4444" />;
      case 'LOCAL_ONLY':
      default:
        return <Ionicons name="cloud-offline-outline" size={14} color={colors.textMuted} />;
    }
  };

  const getSyncText = () => {
    switch (syncStatus) {
      case 'SYNCING':
        return t.header.syncing;
      case 'SYNCED':
        return t.header.cloudSynced;
      case 'ERROR':
        return t.header.syncError;
      case 'LOCAL_ONLY':
      default:
        return t.header.offlineMode;
    }
  };

  const handleProfilePress = async () => {
    await HapticsService.selectionTick();
    onOpenProfile();
  };

  const handleAchievementsPress = async () => {
    await HapticsService.selectionTick();
    dispatch(setAchievementsModalVisible(true));
  };

  const handleToggleTheme = async () => {
    await HapticsService.selectionTick();
    await toggleTheme();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 16) + 6,
          backgroundColor: colors.bgCard,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Left: User Vector Icon & Manager Profile Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.userAvatarBox,
            {
              backgroundColor: isDark ? colors.bgCardSecondary : '#EFF6FF',
              borderColor: isDark ? colors.border : '#BFDBFE',
            },
          ]}
        >
          <Ionicons name="person" size={18} color={colors.primary} />
        </View>

        <View style={styles.managerInfo}>
          <Text
            style={[styles.managerName, { color: colors.text }]}
            numberOfLines={1}
          >
            {profile.username || t.header.rookieManager}
          </Text>
          <View style={styles.syncRow}>
            {getSyncIcon()}
            <Text
              style={[
                styles.syncText,
                { color: colors.textMuted },
                syncStatus === 'SYNCED' && styles.syncTextSynced,
                syncStatus === 'SYNCING' && { color: colors.primary },
                syncStatus === 'ERROR' && styles.syncTextError,
              ]}
            >
              {getSyncText()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Right: Theme Toggle + Trophy Achievements Button + Coins Counter */}
      <View style={styles.rightActions}>
        {/* Theme Toggle Button (Dark / Light Mode) */}
        <TouchableOpacity
          style={[
            styles.themeToggleButton,
            {
              backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9',
              borderColor: colors.border,
            },
          ]}
          onPress={handleToggleTheme}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={17}
            color={isDark ? '#FBBF24' : '#64748B'}
          />
        </TouchableOpacity>

        {/* Trophy / Achievements Button */}
        <TouchableOpacity
          style={[
            styles.trophyButton,
            {
              backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9',
              borderColor: colors.border,
            },
            unclaimedCount > 0 && styles.trophyButtonHighlight,
          ]}
          onPress={handleAchievementsPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trophy-outline"
            size={18}
            color={unclaimedCount > 0 ? '#B45309' : colors.textMuted}
          />
          {unclaimedCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{unclaimedCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Coins Counter */}
        <View
          style={[
            styles.coinsBadge,
            {
              backgroundColor: isDark ? '#451A03' : '#FEF3C7',
              borderColor: isDark ? '#D97706' : '#FDE68A',
            },
          ]}
        >
          <Ionicons name="cash-outline" size={16} color={isDark ? '#F59E0B' : '#D97706'} />
          <Text style={[styles.coinsAmount, { color: isDark ? '#FEF3C7' : '#92400E' }]}>
            {coins.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  userAvatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  managerInfo: {
    justifyContent: 'center',
  },
  managerName: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  syncText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  syncTextSynced: {
    color: '#10B981',
  },
  syncTextSyncing: {
    color: NBA_THEME.nbaNavy,
  },
  syncTextError: {
    color: '#EF4444',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeToggleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  trophyButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  trophyButtonHighlight: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 5,
  },
  coinsAmount: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '900',
  },
});
