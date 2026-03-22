import clsx from 'clsx';
import Flag from 'react-flagkit';

import { ICON_CLASS_NAME, SUPPORTED_LANGUAGES } from '@shared/consts';
import { useLanguage } from '@shared/hooks';
import type { Language } from '@shared/types';
import { Button, Dropdown } from '@ui';

const RoundedFlag = ({ isoCode }: { isoCode: string }) => (
  <span
    className={clsx(
      'inline-block rounded-full overflow-hidden shrink-0 border border-fg border-2',
      ICON_CLASS_NAME,
    )}
  >
    <Flag country={isoCode} className="w-full h-full scale-140 origin-center" />
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
      items={Object.entries(SUPPORTED_LANGUAGES).map(([code, { isoCode, label }]) => ({
        label,
        icon: <RoundedFlag isoCode={isoCode} />,
        onSelect: () => setLanguage(code as Language),
      }))}
    />
  );
};
