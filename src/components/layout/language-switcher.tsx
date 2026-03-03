import Flag from "react-flagkit";
import { SUPPORTED_LANGUAGES } from "@/consts";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/dropdown/dropdown";


export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as "en" | "ru" | "de" | "pl";

  return (
    <Dropdown
      trigger={
        <div className="p-1 cursor-pointer flex items-center">
          <span className="inline-block w-8 h-8 rounded-full overflow-hidden shrink-0 border border-fg border-2">
            <Flag
              country={SUPPORTED_LANGUAGES[currentLanguage].isoCode}
              className="w-full h-full scale-140 origin-center"
            />
          </span>
        </div>
      }
      items={Object.entries(SUPPORTED_LANGUAGES).map(([code, { isoCode, label }]) => (
        {
          label,
          icon: (<span className="inline-block w-8 h-8 rounded-full overflow-hidden shrink-0 border border-fg border-2">
            <Flag
              country={isoCode}
              className="w-full h-full scale-140 origin-center"
            />
          </span>),
          onSelect: () => i18n.changeLanguage(code)

        }
      ))}
    />
  )
}
