import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthService } from '../services/auth';
import { SyncService } from '../services/sync';
import { HapticsService } from '../services/haptics';
import { NBA_THEME } from '../theme/colors';
import { CustomInput } from '../components/Common/CustomInput';
import { CustomButton } from '../components/Common/CustomButton';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateText,
  validateRequired,
} from '../utils/validators';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  // Per-field errors for real-time and submit validations
  const [errors, setErrors] = useState<{
    email?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    username?: string | null;
    phone?: string | null;
  }>({});

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Validation helper
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    let valid = true;

    // Validate email with @ and domain
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.errorMessage;
      valid = false;
    }

    // Validate password > 6 chars
    const passResult = validatePassword(password);
    if (!passResult.isValid) {
      newErrors.password = passResult.errorMessage;
      valid = false;
    }

    if (!isLoginMode) {
      // Validate confirm password
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Debes confirmar tu contraseña';
        valid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
        valid = false;
      }

      // Validate manager/team name
      const userResult = validateText(username, 'El nombre de manager', 3, 25);
      if (!userResult.isValid) {
        newErrors.username = userResult.errorMessage;
        valid = false;
      }

      // Validate optional phone
      if (phone.trim().length > 0) {
        const phoneResult = validatePhone(phone);
        if (!phoneResult.isValid) {
          newErrors.phone = phoneResult.errorMessage;
          valid = false;
        }
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear general error
    if (generalError) setGeneralError(null);

    if (field === 'email') {
      setEmail(value);
      if (errors.email) {
        const res = validateEmail(value);
        setErrors((prev) => ({ ...prev, email: res.isValid ? null : res.errorMessage }));
      }
    } else if (field === 'password') {
      setPassword(value);
      if (errors.password) {
        const res = validatePassword(value);
        setErrors((prev) => ({ ...prev, password: res.isValid ? null : res.errorMessage }));
      }
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
      if (errors.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: value === password ? null : 'Las contraseñas no coinciden',
        }));
      }
    } else if (field === 'username') {
      setUsername(value);
      if (errors.username) {
        const res = validateText(value, 'El nombre de manager', 3, 25);
        setErrors((prev) => ({ ...prev, username: res.isValid ? null : res.errorMessage }));
      }
    } else if (field === 'phone') {
      setPhone(value);
      if (errors.phone) {
        const res = validatePhone(value);
        setErrors((prev) => ({ ...prev, phone: res.isValid ? null : res.errorMessage }));
      }
    }
  };

  const handleAuthSubmit = async () => {
    if (!validateForm()) {
      await HapticsService.errorNotification();
      return;
    }

    setLoading(true);
    setGeneralError(null);

    try {
      if (isLoginMode) {
        await AuthService.signIn(email.trim(), password);
        await HapticsService.celebrate();
        onAuthSuccess();
      } else {
        await AuthService.signUp(email.trim(), password, username.trim());
        await HapticsService.celebrate();
        onAuthSuccess();
      }
    } catch (e: any) {
      setGeneralError(e.message || 'Ocurrió un error inesperado');
      await HapticsService.errorNotification();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20) + 10,
            paddingBottom: Math.max(insets.bottom, 20) + 14,
          },
        ]}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        {/* Header con Imagen Local NBA */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/nba-logo.png')}
            style={styles.localLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>NBA SQUAD BUILDER</Text>
          <Text style={styles.subtitle}>
            {isLoginMode
              ? 'Inicia sesión para sincronizar tus cartas y quinteto'
              : 'Regístrate y asegura tu franquicia en la nube'}
          </Text>
        </View>

        {/* Tarjeta de Formulario */}
        <View style={styles.ticketCard}>
          {/* Pestañas: Iniciar Sesión / Registro */}
          <View style={styles.tabContainer}>
            <CustomButton
              title="INICIAR SESIÓN"
              onPress={() => {
                setIsLoginMode(true);
                setErrors({});
                setGeneralError(null);
                HapticsService.selectionTick();
              }}
              variant={isLoginMode ? 'primary' : 'secondary'}
              size="sm"
              iconName="log-in-outline"
              style={[styles.tabButton, isLoginMode && styles.tabButtonActive]}
            />

            <CustomButton
              title="CREAR CUENTA"
              onPress={() => {
                setIsLoginMode(false);
                setErrors({});
                setGeneralError(null);
                HapticsService.selectionTick();
              }}
              variant={!isLoginMode ? 'primary' : 'secondary'}
              size="sm"
              iconName="person-add-outline"
              style={[styles.tabButton, !isLoginMode && styles.tabButtonActive]}
            />
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Campo Nombre / Franquicia (Solo Registro) */}
            {!isLoginMode && (
              <CustomInput
                label="NOMBRE DE MANAGER O FRANQUICIA"
                value={username}
                onChangeText={(val) => handleInputChange('username', val)}
                placeholder="Ej. Coach Phil Jackson"
                type="text"
                required
                leftIconName="person-outline"
                error={errors.username}
                showClearButton
              />
            )}

            {/* Campo Correo Electrónico (Valida @ y dominio) */}
            <CustomInput
              label="CORREO ELECTRÓNICO"
              value={email}
              onChangeText={(val) => handleInputChange('email', val)}
              placeholder="manager@nba.com"
              type="email"
              required
              leftIconName="mail-outline"
              error={errors.email}
              showClearButton
            />

            {/* Campo Teléfono Móvil (Solo Registro - Valida numérico) */}
            {!isLoginMode && (
              <CustomInput
                label="TELÉFONO DE CONTACTO"
                value={phone}
                onChangeText={(val) => handleInputChange('phone', val)}
                placeholder="+504 9988-7766"
                type="phone"
                required
                leftIconName="call-outline"
                error={errors.phone}
                showClearButton
              />
            )}

            {/* Campo Contraseña (Valida > 6 caracteres con Toggle Ver/Ocultar) */}
            <CustomInput
              label="CONTRASEÑA (MÁS DE 6 CARACTERES)"
              value={password}
              onChangeText={(val) => handleInputChange('password', val)}
              placeholder="Mínimo 7 caracteres"
              type="password"
              required
              leftIconName="lock-closed-outline"
              error={errors.password}
            />

            {/* Campo Confirmar Contraseña (Solo Registro) */}
            {!isLoginMode && (
              <CustomInput
                label="CONFIRMAR CONTRASEÑA"
                value={confirmPassword}
                onChangeText={(val) => handleInputChange('confirmPassword', val)}
                placeholder="Repite tu contraseña"
                type="password"
                required
                leftIconName="shield-checkmark-outline"
                error={errors.confirmPassword}
              />
            )}

            {/* Mensaje de Error General */}
            {generalError && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <Text style={styles.errorBoxText}>{generalError}</Text>
              </View>
            )}

            {/* Beneficio de la nube con icono de @expo/vector-icons */}
            <View style={styles.cloudBenefitRow}>
              <Ionicons name="cloud-done-outline" size={18} color={NBA_THEME.nbaNavy} />
              <Text style={styles.cloudBenefitText}>
                Tus cartas, monedas y alineación se guardarán en Supabase Cloud
              </Text>
            </View>

            {/* Botón Principal de Envío */}
            <CustomButton
              title={isLoginMode ? 'INGRESAR AL JUEGO' : 'REGISTRAR MI FRANQUICIA'}
              onPress={handleAuthSubmit}
              variant="primary"
              size="lg"
              loading={loading}
              iconName={isLoginMode ? 'arrow-forward-outline' : 'checkmark-circle-outline'}
              iconPosition="right"
              fullWidth
              style={styles.submitBtn}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  localLogo: {
    width: 65,
    height: 65,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 6,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
  },
  tabButtonActive: {
    elevation: 1,
  },
  form: {
    padding: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBoxText: {
    color: '#DC2626',
    fontSize: 13,
    flex: 1,
    fontWeight: '600',
  },
  cloudBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 18,
  },
  cloudBenefitText: {
    fontSize: 12,
    color: NBA_THEME.nbaNavy,
    flex: 1,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 4,
  },
  guestSection: {
    alignItems: 'center',
    marginTop: 22,
    gap: 8,
  },
  guestHint: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
