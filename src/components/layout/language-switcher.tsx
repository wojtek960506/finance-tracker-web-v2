import clsx from "clsx";
import Flag from "react-flagkit";
import { useLanguage } from "@/hooks";
import type { Language } from "@/types";
import { Button } from "@components/ui";
import { SUPPORTED_LANGUAGES } from "@/consts";
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
  const { language, setLanguage } = useLanguage();

  return (
    <Dropdown
      trigger={
        <Button variant="ghost">
          <RoundedFlag isoCode={SUPPORTED_LANGUAGES[language].isoCode} />
        </Button>
      }
      items={Object.entries(SUPPORTED_LANGUAGES).map(([code, { isoCode, label }]) => (
        {
          label,
          icon: (<RoundedFlag isoCode={isoCode} />),
          onSelect: () => setLanguage(code as Language),
        }
      ))}
    />
  )
}
