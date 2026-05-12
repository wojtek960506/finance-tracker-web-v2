import { resolveApiBaseUrl } from './config/resolve-api-base-url';
import type { Language, LanguageProps } from './types';

export const BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const LANGUAGE_STORE_KEY = 'language';
export const AUTH_TOKEN_STORE_KEY = 'auth-token';
export const LOCAL_STORAGE_CHANGE_EVENT = 'local-storage-change';

export const SUPPORTED_LANGUAGES: Record<Language, LanguageProps> = {
  en: { label: 'English', isoCode: 'GB' },
  pl: { label: 'Polski', isoCode: 'PL' },
  de: { label: 'Deutsch', isoCode: 'DE' },
  ru: { label: 'Русский', isoCode: 'RU' },
};

export const IS_SM_MEDIA_QUERY = '(min-width: 640px)';
export const IS_MD_MEDIA_QUERY = '(min-width: 768px)';
export const IS_LG_MEDIA_QUERY = '(min-width: 1024px)';
// export const IS_XL_MEDIA_QUERY = '(min-width: 1280px)';
export const IS_XL_MEDIA_QUERY = '(min-width: 1400px)';
export const IS_2XL_MEDIA_QUERY = '(min-width: 1536px)';

export const ICON_CLASS_NAME = 'w-7 h-7 sm:w-8 sm:h-8';

export const MAIN_BUTTON_TEXT = 'text-lg sm:text-xl font-semibold sm:font-bold';
export const FORM_CONTROL_SIZE_CLASS =
  'h-10 sm:h-11 rounded-xl px-3 sm:px-4 text-base sm:text-lg';
export const FORM_CONTROL_SURFACE_CLASS =
  'border border-fg bg-bg text-fg transition-colors hover:bg-fg/5 focus-visible:border-fg focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-bg';
export const FORM_BUTTON_SIZE_CLASS = FORM_CONTROL_SIZE_CLASS;
