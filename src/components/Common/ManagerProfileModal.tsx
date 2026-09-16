import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthService, ManagerProfile } from '../../services/auth';
import { SyncService } from '../../services/sync';
import { HapticsService } from '../../services/haptics';
import { NBA_THEME } from '../../theme/colors';
import { CustomButton } from './CustomButton';
import { CustomBadge } from './CustomBadge';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setAppLanguage, setAchievementsModalVisible } from '../../store/slices/squadSlice';
import { useTranslation } from '../../i18n/useTranslation';

interface ManagerProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSignOut: () => void;
  onProfileUpdated?: () => void;
}

export const ManagerProfileModal: React.FC<ManagerProfileModalProps> = ({
  visible,
  onClose,
  onSignOut,
  onProfileUpdated,
}) => {
  const dispatch = useAppDispatch();
  const { t, language } = useTranslation();
  const coins = useAppSelector((state) => state.squad.coins);
  const cards = useAppSelector((state) => state.squad.cards);
  const claimedAchievements = useAppSelector((state) => state.squad.claimedAchievements);

  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadProfileData();
    }
  }, [visible]);

  const loadProfileData = async () => {
    const p = await AuthService.getProfile();
    const guest = await AuthService.isGuest();
    setProfile(p);
    setIsGuest(guest);
  };

  const handleLanguageChange = async (newLang: 'es' | 'en') => {
    if (newLang === language) return;
    await HapticsService.selectionTick();
    dispatch(setAppLanguage(newLang));
  };

  const handleOpenTrophies = async () => {
    await HapticsService.selectionTick();
    onClose();
    setTimeout(() => {
      dispatch(setAchievementsModalVisible(true));
    }, 250);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    await HapticsService.mediumImpact();
    const success = await SyncService.pushLocalToCloud();
    setSyncing(false);

    if (success) {
      await HapticsService.successNotification();
      Alert.alert(
        language === 'es' ? 'Sincronización Exitosa' : 'Sync Successful',
        language === 'es'
          ? 'Todas tus cartas, monedas y quinteto están respaldados en la nube.'
          : 'All your cards, coins, and lineup are backed up in the cloud.'
      );
    } else {
      await HapticsService.errorNotification();
      Alert.alert(
        language === 'es' ? 'Modo Local' : 'Local Mode',
        isGuest
          ? (language === 'es'
              ? 'Estás jugando en Modo Invitado. Vincula tu cuenta para guardar en la nube.'
              : 'You are playing in Guest Mode. Link your account to back up to the cloud.')
          : (language === 'es'
              ? 'No se pudo conectar con el servidor. Revisa tu conexión a internet.'
              : 'Could not connect to server. Please check your internet connection.')
      );
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      t.profile.signOutButton,
      language === 'es'
        ? '¿Deseas cerrar tu sesión? Tu progreso sincronizado permanecerá seguro en la nube.'
        : 'Do you want to sign out? Your synced progress will remain safe in the cloud.',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.profile.signOutButton,
          style: 'destructive',
          onPress: async () => {
            await HapticsService.mediumImpact();
            onClose();
            onSignOut();
          },
        },
      ]
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
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.headerTopRow}>
              <Image
                source={require('../../../assets/nba-logo.png')}
                style={styles.nbaLogo}
                resizeMode="contain"
              />

              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Profile Avatar & Name */}
            <View style={styles.avatarRow}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={26} color="#FFFFFF" />
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {profile?.username || (isGuest ? t.header.rookieManager : 'NBA Manager')}
                </Text>
                <CustomBadge
                  label={isGuest ? t.profile.rookieBadge : t.profile.managerBadge}
                  variant={isGuest ? 'warning' : 'gold'}
                  iconName="shield-checkmark"
                  size="sm"
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Ionicons name="cash-outline" size={20} color="#D97706" />
                <Text style={styles.statVal}>{coins.toLocaleString()}</Text>
                <Text style={styles.statLabel}>{t.common.coins}</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="albums-outline" size={20} color={NBA_THEME.nbaNavy} />
                <Text style={styles.statVal}>{cards.length}</Text>
                <Text style={styles.statLabel}>{t.common.totalCards}</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="trophy-outline" size={20} color="#EAB308" />
                <Text style={styles.statVal}>{claimedAchievements.length}</Text>
                <Text style={styles.statLabel}>{t.header.trophies}</Text>
              </View>
            </View>

            {/* Language Selector */}
            <View style={styles.languageSection}>
              <Text style={styles.sectionTitle}>{t.profile.language}</Text>
              <View style={styles.languageButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.langButton,
                    language === 'es' && styles.langButtonActive,
                  ]}
                  onPress={() => handleLanguageChange('es')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.langButtonText,
                      language === 'es' && styles.langButtonTextActive,
                    ]}
                  >
                    Español (ES)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.langButton,
                    language === 'en' && styles.langButtonActive,
                  ]}
                  onPress={() => handleLanguageChange('en')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.langButtonText,
                      language === 'en' && styles.langButtonTextActive,
                    ]}
                  >
                    English (EN)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Trophy Room Quick Access */}
            <TouchableOpacity
              style={styles.trophyAccessCard}
              onPress={handleOpenTrophies}
              activeOpacity={0.7}
            >
              <View style={styles.trophyIconCircle}>
                <Ionicons name="trophy" size={20} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trophyCardTitle}>{t.profile.trophyRoom}</Text>
                <Text style={styles.trophyCardDesc}>
                  {language === 'es'
                    ? 'Consulta tus logros de franquicias, leyendas y recompensas.'
                    : 'Check your franchise milestones, legends, and coin rewards.'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Cloud Status Card */}
            <View style={styles.cloudInfoCard}>
              <Ionicons
                name={isGuest ? 'cloud-offline-outline' : 'cloud-done-outline'}
                size={20}
                color={isGuest ? '#D97706' : '#10B981'}
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.cloudInfoTitle}>
                  {isGuest ? t.profile.localSaved : t.profile.cloudSaved}
                </Text>
                <Text style={styles.cloudInfoDesc}>
                  {isGuest ? t.profile.localDesc : t.profile.cloudDesc}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <CustomButton
                title={syncing ? t.common.loading : t.profile.syncButton}
                onPress={handleManualSync}
                variant="primary"
                size="md"
                loading={syncing}
                iconName="cloud-upload-outline"
                fullWidth
                style={styles.actionMargin}
              />

              <CustomButton
                title={t.profile.signOutButton}
                onPress={handleSignOut}
                variant="danger"
                size="md"
                iconName="log-out-outline"
                fullWidth
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  cardHeader: {
    backgroundColor: NBA_THEME.nbaNavy,
    padding: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nbaLogo: {
    width: 30,
    height: 30,
  },
  closeBtn: {
    padding: 4,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  nameContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  body: {
    padding: 16,
    gap: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 3,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  languageSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  languageButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langButtonActive: {
    backgroundColor: NBA_THEME.nbaNavy,
    borderColor: NBA_THEME.nbaNavy,
  },
  langButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  langButtonTextActive: {
    color: '#FFFFFF',
  },
  trophyAccessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  trophyIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  trophyCardDesc: {
    fontSize: 10,
    color: '#B45309',
    marginTop: 1,
  },
  cloudInfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
  },
  cloudInfoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  cloudInfoDesc: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14,
  },
  actions: {
    marginTop: 2,
  },
  actionMargin: {
    marginBottom: 8,
  },
});
