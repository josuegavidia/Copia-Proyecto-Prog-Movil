import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NBA_THEME } from '../../theme/colors';

export type InputType = 'text' | 'email' | 'password' | 'phone' | 'number';

export interface CustomInputProps extends Omit<TextInputProps, 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: InputType;
  error?: string | null;
  required?: boolean;
  leftIconName?: keyof typeof Ionicons.glyphMap;
  showClearButton?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  helperText?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  type = 'text',
  error,
  required = false,
  leftIconName,
  showClearButton = false,
  containerStyle,
  inputStyle,
  helperText,
  editable = true,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Configuración predeterminada según el tipo
  const isPassword = type === 'password';
  const keyboardType =
    type === 'email'
      ? 'email-address'
      : type === 'phone'
      ? 'phone-pad'
      : type === 'number'
      ? 'numeric'
      : 'default';

  const defaultIconName: keyof typeof Ionicons.glyphMap =
    leftIconName ||
    (type === 'email'
      ? 'mail-outline'
      : type === 'password'
      ? 'lock-closed-outline'
      : type === 'phone'
      ? 'call-outline'
      : 'person-outline');

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleContainerPress = () => {
    if (editable) {
      inputRef.current?.focus();
    }
  };

  const hasError = !!error;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {/* Etiqueta / Label con indicador obligatorio */}
      {label && (
        <Pressable onPress={handleContainerPress} style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Pressable>
      )}

      {/* Contenedor del Input con Estilos Condicionales y Enfoque Inmediato */}
      <Pressable
        onPress={handleContainerPress}
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {/* Icono izquierdo */}
        <Ionicons
          name={defaultIconName}
          size={20}
          color={
            hasError
              ? NBA_THEME.danger
              : isFocused
              ? NBA_THEME.nbaNavy
              : NBA_THEME.textMuted
          }
          style={styles.leftIcon}
        />

        {/* Campo de Entrada de Texto */}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          autoCapitalize={type === 'email' || type === 'password' ? 'none' : 'sentences'}
          autoCorrect={false}
          secureTextEntry={isPassword && !isPasswordVisible}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, inputStyle]}
          {...restProps}
        />

        {/* Botón para Limpiar Texto */}
        {showClearButton && value.length > 0 && editable && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.actionIcon}
          >
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}

        {/* Botón para Alternar Ver/Ocultar Contraseña */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.actionIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isFocused ? NBA_THEME.nbaNavy : NBA_THEME.textMuted}
            />
          </TouchableOpacity>
        )}
      </Pressable>

      {/* Mensaje de Error Condicional o Texto de Ayuda */}
      {hasError ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={NBA_THEME.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: NBA_THEME.textDark,
  },
  requiredStar: {
    fontSize: 13,
    fontWeight: '700',
    color: NBA_THEME.danger,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: NBA_THEME.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: NBA_THEME.nbaNavy,
    backgroundColor: '#FAFCFF',
    shadowColor: NBA_THEME.nbaNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerError: {
    borderColor: NBA_THEME.danger,
    backgroundColor: '#FFF8F8',
  },
  inputContainerDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: NBA_THEME.textDark,
    paddingVertical: 0,
  },
  actionIcon: {
    padding: 4,
    marginLeft: 6,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: NBA_THEME.danger,
    marginLeft: 4,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: NBA_THEME.textMuted,
    marginTop: 4,
    paddingLeft: 2,
  },
});
