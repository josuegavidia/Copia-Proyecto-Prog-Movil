/**
 * Utilidades de validación para formularios y entradas de usuario.
 * Cumple con los requerimientos del entregable docente:
 * - Email válido (incluye '@' y formato de dominio).
 * - Contraseña (mayor a 6 caracteres).
 * - Teléfono (formato numérico/internacional).
 * - Campos obligatorios y textos con longitud mínima.
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Valida que un campo obligatorio no esté vacío.
 */
export const validateRequired = (value: string, fieldName: string = 'Este campo'): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: `${fieldName} es obligatorio.`,
    };
  }
  return { isValid: true };
};

/**
 * Valida un correo electrónico (debe incluir '@' y estructura de dominio válida).
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'El correo electrónico es obligatorio.',
    };
  }

  if (!email.includes('@')) {
    return {
      isValid: false,
      errorMessage: 'El correo electrónico debe incluir el carácter "@".',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      errorMessage: 'Ingresa un formato de correo electrónico válido (ej. usuario@ejemplo.com).',
    };
  }

  return { isValid: true };
};

/**
 * Valida que la contraseña sea mayor a 6 caracteres.
 */
export const validatePassword = (password: string, minLength: number = 6): ValidationResult => {
  if (!password || password.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'La contraseña es obligatoria.',
    };
  }

  // Se solicita específicamente que sea mayor a 6 caracteres (mínimo 7 caracteres o al menos 6)
  if (password.length <= minLength) {
    return {
      isValid: false,
      errorMessage: `La contraseña debe tener más de ${minLength} caracteres (mínimo ${minLength + 1}).`,
    };
  }

  return { isValid: true };
};

/**
 * Valida número de teléfono (dígitos, mínimo 8 caracteres, soporte de prefijo +).
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'El número de teléfono es obligatorio.',
    };
  }

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^\+?[0-9]{8,15}$/;

  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      errorMessage: 'Ingresa un número de teléfono válido (mínimo 8 dígitos numéricos).',
    };
  }

  return { isValid: true };
};

/**
 * Valida un campo de texto general (ej. Nombre de Manager o Franquicia).
 */
export const validateText = (
  text: string,
  fieldName: string = 'El nombre',
  minLength: number = 3,
  maxLength: number = 40
): ValidationResult => {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: `${fieldName} es obligatorio.`,
    };
  }

  if (text.trim().length < minLength) {
    return {
      isValid: false,
      errorMessage: `${fieldName} debe tener al menos ${minLength} caracteres.`,
    };
  }

  if (text.trim().length > maxLength) {
    return {
      isValid: false,
      errorMessage: `${fieldName} no debe exceder ${maxLength} caracteres.`,
    };
  }

  return { isValid: true };
};
