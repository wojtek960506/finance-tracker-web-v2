import type { Language, LanguageProps } from "./types";


export const BASE_URL = "http://localhost:5000";

export const SUPPORTED_LANGUAGES: Record<Language, LanguageProps> = {
  en: { label: "English", isoCode: "GB" },
  pl: { label: "Polski", isoCode: "PL" },
  de: { label: "Deutsch", isoCode: "DE" },
  ru: { label: "Русский", isoCode: "RU" },
}
