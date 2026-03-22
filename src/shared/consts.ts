import type { Language, LanguageProps } from './types';

export const BASE_URL = 'http://localhost:5000';

export const LANGUAGE_STORE_KEY = 'language';

export const SUPPORTED_LANGUAGES: Record<Language, LanguageProps> = {
  en: { label: 'English', isoCode: 'GB' },
  pl: { label: 'Polski', isoCode: 'PL' },
  de: { label: 'Deutsch', isoCode: 'DE' },
  ru: { label: 'Русский', isoCode: 'RU' },
};

export const IS_DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

export const ICON_CLASS_NAME = 'w-7 h-7 md:w-8 md:h-8';
