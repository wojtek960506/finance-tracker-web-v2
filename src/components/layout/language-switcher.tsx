import Flag from "react-flagkit";
import { SUPPORTED_LANGUAGES } from "@/consts";
import { useTranslation } from "react-i18next";


export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-3 items-center">
      {Object.entries(SUPPORTED_LANGUAGES).map(([code, { isoCode }]) => (
        <button
          key={code}
          onClick={(() => i18n.changeLanguage(code))}
          className="flex gap-2 items-center cursor-pointer p-1 border border-fg "
        >
          <span className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Flag
              country={isoCode}
              className="w-full h-full scale-140 origin-center"
            />
          </span>
        </button>
      ))}
    </div>
  )
}
