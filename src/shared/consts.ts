import type { Language, LanguageProps } from './types';

// export const BASE_URL = 'http://localhost:5000';
export const BASE_URL = 'http://192.168.0.244:5000';

export const LANGUAGE_STORE_KEY = 'language';

export const SUPPORTED_LANGUAGES: Record<Language, LanguageProps> = {
  en: { label: 'English', isoCode: 'GB' },
  pl: { label: 'Polski', isoCode: 'PL' },
  de: { label: 'Deutsch', isoCode: 'DE' },
  ru: { label: 'Русский', isoCode: 'RU' },
};

export const IS_SM_MEDIA_QUERY = '(min-width: 640px)';
export const IS_MD_MEDIA_QUERY = '(min-width: 768px)';
export const IS_LG_MEDIA_QUERY = '(min-width: 1024px)';
export const IS_XL_MEDIA_QUERY = '(min-width: 1280px)';
export const IS_2XL_MEDIA_QUERY = '(min-width: 1536px)';

export const ICON_CLASS_NAME = 'w-7 h-7 sm:w-8 sm:h-8';
