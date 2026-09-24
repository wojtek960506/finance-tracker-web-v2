import { useTranslation } from 'react-i18next';

import { useSettingsStore } from '@store/settings-store';
import { CurrencySelectField } from '@transactions/components/shared';
import { Card } from '@ui';

export const SettingsPage = () => {
  const { t } = useTranslation('settings');
  const baseCurrency = useSettingsStore((state) => state.baseCurrency);
  const setBaseCurrency = useSettingsStore((state) => state.setBaseCurrency);

  const handleCurrencyChange = (newCurrency: string) => {
    if (newCurrency) {
      setBaseCurrency(newCurrency);
    }
  };

  return (
    <div
      className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-0 xs:px-2 sm:px-3"
      data-testid="settings-page"
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {t('title')}
        </h1>
        <p className="text-xs text-text-muted sm:text-sm">{t('description')}</p>
      </div>

      <Card className="gap-5 p-4 sm:p-6">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            {t('generalPreferences')}
          </h2>
          <p className="text-xs text-text-muted sm:text-sm">
            {t('generalPreferencesDescription')}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-fg/15 bg-bg/50 p-4 sm:p-5">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">
              {t('baseCurrency')}
            </span>
            <span className="text-xs text-text-muted">
              {t('baseCurrencyDescription')}
            </span>
          </div>

          <div className="w-full max-w-xs pt-1">
            <CurrencySelectField
              value={baseCurrency}
              onChange={handleCurrencyChange}
              placeholder={t('baseCurrency')}
              searchPlaceholder={t('searchCurrencyPlaceholder')}
              emptyMessage={t('noCurrenciesFound')}
              showClear={false}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
