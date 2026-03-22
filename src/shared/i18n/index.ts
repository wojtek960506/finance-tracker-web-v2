import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGE_STORE_KEY } from '@shared/consts';
import { readLocalStorage } from '@shared/utils';

const FALLBACK_LNG = 'en';
const savedLanguage = readLocalStorage<string>(LANGUAGE_STORE_KEY) || FALLBACK_LNG;

const localeModules = import.meta.glob<{ default: Record<string, unknown> }>(
  './locales/*/*.json',
  { eager: true },
);

const resources = Object.entries(localeModules).reduce<
  Record<string, Record<string, Record<string, unknown>>>
>((acc, [path, mod]) => {
  const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!match) return acc;

  const [, lang, ns] = match;
  acc[lang] ??= {};
  acc[lang][ns] = mod.default;

  return acc;
}, {});

i18n.use(initReactI18next).init({
  lng: savedLanguage,
  fallbackLng: FALLBACK_LNG,
  debug: true,

  // saveMissing: true,
  // missingKeyHandler: (lng, ns, key) => {
  //   console.warn(`Missing translation -> ${lng}:${ns}:${key}`)
  // },

  resources,
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

// ä: Ctrl+Shift+U then e4
// ö: Ctrl+Shift+U then f6
// ü: Ctrl+Shift+U then fc
// ß: Ctrl+Shift+U then df
