import type { Language } from "@/types";
import { LANGUAGE_STORE_KEY } from "@/consts";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "./use-local-storage";


export const useLanguage = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;
  
  const {
    item,
    setItem,
  } = useLocalStorage<Language>(LANGUAGE_STORE_KEY, currentLanguage);

  const setLanguage = (code: Language) => {
    setItem(code);
    i18n.changeLanguage(code);
  }

  return { language: item ?? "en", setLanguage }
}
