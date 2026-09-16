import { es } from './locales/es';
import { en } from './locales/en';
import { Language, TranslationSchema } from './types';

export const translations: Record<Language, TranslationSchema> = {
  es,
  en,
};

export const getTranslation = (lang: Language): TranslationSchema => {
  return translations[lang] || translations.es;
};

export * from './types';
