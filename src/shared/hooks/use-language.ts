import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LANGUAGE_STORE_KEY } from '@shared/consts';
import type { Language } from '@shared/types';

import { useLocalStorage } from './use-local-storage';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;

  const { item, setItem } = useLocalStorage<Language>(
    LANGUAGE_STORE_KEY,
    currentLanguage,
  );

  useEffect(() => {
    if (item && item != i18n.language) {
      console.log('language changed')
      void i18n.changeLanguage(item);
    }
  }, [item, i18n]);

  const setLanguage = (code: Language) => setItem(code);

  return { language: item ?? 'en', setLanguage };
};
