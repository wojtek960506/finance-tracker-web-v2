import clsx from "clsx";
import Flag from "react-flagkit";
import type { Language } from "@/types";
import { Button } from "@components/ui";
import { SUPPORTED_LANGUAGES } from "@/consts";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/dropdown/dropdown";


const RoundedFlag = ({ isoCode }: { isoCode: string }) => (
  <span className={clsx(
    "inline-block w-8 h-8 rounded-full overflow-hidden shrink-0 border border-fg border-2"
  )}>
    <Flag
      country={isoCode}
      className="w-full h-full scale-140 origin-center"
    />
  </span>
);

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;

  return (
    <Dropdown
      trigger={
        <Button variant="ghost">
          <RoundedFlag isoCode={SUPPORTED_LANGUAGES[currentLanguage].isoCode} />
        </Button>
      }
      items={Object.entries(SUPPORTED_LANGUAGES).map(([code, { isoCode, label }]) => (
        {
          label,
          icon: (<RoundedFlag isoCode={isoCode} />),
          onSelect: () => i18n.changeLanguage(code),
        }
      ))}
    />
  )
}
