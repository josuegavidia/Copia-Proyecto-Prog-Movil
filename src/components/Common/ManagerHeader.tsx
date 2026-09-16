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
        return <ActivityIndicator size={12} color={NBA_THEME.nbaNavy} />;
      case 'SYNCED':
        return <Ionicons name="cloud-done" size={14} color="#10B981" />;
      case 'ERROR':
        return <Ionicons name="alert-circle" size={14} color="#EF4444" />;
      case 'LOCAL_ONLY':
      default:
        return <Ionicons name="cloud-offline-outline" size={14} color="#94A3B8" />;
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

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) + 6 }]}>
      {/* Left: User Vector Icon & Manager Profile Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.userAvatarBox}>
          <Ionicons name="person" size={18} color="#006BB6" />
        </View>

        <View style={styles.managerInfo}>
          <Text style={styles.managerName} numberOfLines={1}>
            {profile.username || t.header.rookieManager}
          </Text>
          <View style={styles.syncRow}>
            {getSyncIcon()}
            <Text
              style={[
                styles.syncText,
                syncStatus === 'SYNCED' && styles.syncTextSynced,
                syncStatus === 'SYNCING' && styles.syncTextSyncing,
                syncStatus === 'ERROR' && styles.syncTextError,
              ]}
            >
              {getSyncText()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Right: Trophy Achievements Button + Coins Counter */}
      <View style={styles.rightActions}>
        {/* Trophy / Achievements Button */}
        <TouchableOpacity
          style={[styles.trophyButton, unclaimedCount > 0 && styles.trophyButtonHighlight]}
          onPress={handleAchievementsPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trophy-outline"
            size={18}
            color={unclaimedCount > 0 ? '#B45309' : '#64748B'}
          />
          {unclaimedCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{unclaimedCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Coins Counter */}
        <View style={styles.coinsBadge}>
          <Ionicons name="cash-outline" size={16} color="#D97706" />
          <Text style={styles.coinsAmount}>
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
