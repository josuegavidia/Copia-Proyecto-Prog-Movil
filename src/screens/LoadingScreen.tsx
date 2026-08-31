import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NBA_THEME } from '../theme/colors';

interface LoadingScreenProps {
  onFinishLoading: () => void;
}

const NBA_TIPS = [
  'Calentando en la duela...',
  'Comprobando contratos y quinteto titular...',
  'Sincronizando cartas con la nube de la NBA...',
  'Ajustando la química del equipo con el DT...',
  'Preparando sobres dorados y diamantes...',
  'Revisando estadísticas de la liga...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinishLoading }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotating tips
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentTipIndex((prev) => (prev + 1) % NBA_TIPS.length);
    }, 1800);

    const finishTimeout = setTimeout(() => {
      onFinishLoading();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        {/* Top NBA Official Badge con Imagen Local */}
        <View style={styles.topNbaBadge}>
          <Image
            source={require('../../assets/nba-logo.png')}
            style={styles.smallLogo}
            resizeMode="contain"
          />
          <Text style={styles.topEditionText}>OFFICIAL SQUAD BUILDER</Text>
        </View>

        {/* Central Logo & Title */}
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ionicons name="trophy" size={46} color="#FFFFFF" />
          </Animated.View>

          <Text style={styles.gameTitle}>NBA SQUAD</Text>
          <Text style={styles.gameSubTitle}>BUILDER & DRAFT</Text>

          <View style={styles.badgeRow}>
            <View style={styles.featureBadge}>
              <Ionicons name="sparkles" size={13} color={NBA_THEME.nbaGold} />
              <Text style={styles.featureBadgeText}>CARTAS OFICIALES</Text>
            </View>
            <View style={styles.featureBadge}>
              <Ionicons name="cloud-done" size={13} color={NBA_THEME.nbaNavy} />
              <Text style={styles.featureBadgeText}>CLOUD SAVE</Text>
            </View>
          </View>
        </View>

        {/* Bottom Loading Progress & Tips */}
        <View style={styles.bottomSection}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarFill} />
          </View>

          <Animated.Text style={[styles.loadingTipText, { opacity: textFadeAnim }]}>
            {NBA_TIPS[currentTipIndex]}
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  topNbaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smallLogo: {
    width: 20,
    height: 20,
  },
  topEditionText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: NBA_THEME.nbaNavy,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: NBA_THEME.nbaNavyLight,
    elevation: 4,
    shadowColor: NBA_THEME.nbaNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  gameSubTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: NBA_THEME.nbaNavy,
    letterSpacing: 3.5,
    textAlign: 'center',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureBadgeText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  progressBarContainer: {
    width: '75%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: NBA_THEME.nbaNavy,
  },
  loadingTipText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
