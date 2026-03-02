import i18n from "i18next"
import { initReactI18next } from "react-i18next"
// import LanguageDetector from "i18next-browser-languagedetector"

import enCommon from "./locales/en/common.json";
import plCommon from "./locales/pl/common.json";
import ruCommon from "./locales/ru/common.json";
import deCommon from "./locales/de/common.json";

import enAuth from "./locales/en/auth.json";
import plAuth from "./locales/pl/auth.json";
import ruAuth from "./locales/ru/auth.json";
import deAuth from "./locales/de/auth.json";

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "pl",
    debug: true,

    saveMissing: true,
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Missing translation -> ${lng}:${ns}:${key}`)
    },

    resources: {
      en: {
        auth: enAuth,
        common: enCommon,
      },
      pl: {
        auth: plAuth,
        common: plCommon,
      },
      ru: {
        auth: ruAuth,
        common: ruCommon,
      },
      de: {
        auth: deAuth,
        common: deCommon,
      },
    },

    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n