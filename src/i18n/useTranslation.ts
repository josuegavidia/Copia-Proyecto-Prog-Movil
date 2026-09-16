import { useAppSelector } from '../store/hooks';
import { getTranslation } from './index';
import { TranslationSchema, Language } from './types';

export const useTranslation = () => {
  const language = useAppSelector((state) => (state.squad.language as Language) || 'es');
  const t: TranslationSchema = getTranslation(language);

  return {
    t,
    language,
  };
};
