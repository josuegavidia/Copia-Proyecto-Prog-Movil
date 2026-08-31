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
import { useSquad } from '../../context/SquadContext';

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
  const { coins, cards } = useSquad();
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

  const handleManualSync = async () => {
    setSyncing(true);
    await HapticsService.mediumImpact();
    const success = await SyncService.pushLocalToCloud();
    setSyncing(false);

    if (success) {
      await HapticsService.successNotification();
      Alert.alert(
        'Sincronización Exitosa',
        'Todas tus cartas, monedas y quinteto están respaldados en la nube.'
      );
    } else {
      await HapticsService.errorNotification();
      Alert.alert(
        'Modo Local',
        isGuest
          ? 'Estás jugando en Modo Invitado. Vincula tu cuenta para guardar en la nube.'
          : 'No se pudo conectar con el servidor. Revisa tu conexión a internet.'
      );
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas cerrar tu sesión? Tu progreso sincronizado permanecerá seguro en la nube.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
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
          {/* Header con Imagen Local */}
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
                  {profile?.username || 'NBA Manager'}
                </Text>
                <CustomBadge
                  label={isGuest ? 'ROOKIE (LOCAL)' : 'FRANCHISE MANAGER'}
                  variant={isGuest ? 'warning' : 'gold'}
                  iconName="shield-checkmark"
                  size="sm"
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>
          </View>

          {/* Estadísticas */}
          <View style={styles.body}>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Ionicons name="cash-outline" size={20} color="#D97706" />
                <Text style={styles.statVal}>{coins.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Monedas</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="albums-outline" size={20} color={NBA_THEME.nbaNavy} />
                <Text style={styles.statVal}>{cards.length}</Text>
                <Text style={styles.statLabel}>Cartas Totales</Text>
              </View>
            </View>

            {/* Cloud Status Card */}
            <View style={styles.cloudInfoCard}>
              <Ionicons
                name={isGuest ? 'cloud-offline-outline' : 'cloud-done-outline'}
                size={22}
                color={isGuest ? '#D97706' : '#10B981'}
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.cloudInfoTitle}>
                  {isGuest ? 'Progreso Guardado en Local' : 'Guardado en Supabase Cloud'}
                </Text>
                <Text style={styles.cloudInfoDesc}>
                  {isGuest
                    ? 'Tus cartas se guardan solo en este teléfono. Puedes crear una cuenta para respaldarlas.'
                    : 'Tus datos se respaldan y sincronizan en la nube de la NBA.'}
                </Text>
              </View>
            </View>

            {/* Action Buttons con CustomButton */}
            <View style={styles.actions}>
              <CustomButton
                title={syncing ? 'Sincronizando...' : 'Sincronizar con la Nube'}
                onPress={handleManualSync}
                variant="primary"
                size="md"
                loading={syncing}
                iconName="cloud-upload-outline"
                fullWidth
                style={styles.actionMargin}
              />

              <CustomButton
                title="Cerrar Sesión"
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
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
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
    padding: 18,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nbaLogo: {
    width: 32,
    height: 32,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  body: {
    padding: 18,
    gap: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  cloudInfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  cloudInfoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  cloudInfoDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  actions: {
    marginTop: 4,
  },
  actionMargin: {
    marginBottom: 10,
  },
});
