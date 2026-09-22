import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { NET_WORTH_DEFAULT_CURRENCIES } from '../consts';

type NetWorthCurrencySelectorProps = {
  activeCurrency: string;
  onSelectCurrency: (currency: string) => void;
  availableCurrencies?: string[];
};

export const NetWorthCurrencySelector = ({
  activeCurrency,
  onSelectCurrency,
  availableCurrencies = [],
}: NetWorthCurrencySelectorProps) => {
  const { t } = useTranslation('net-worth');

  const currenciesList = useMemo(() => {
    const set = new Set<string>([
      ...NET_WORTH_DEFAULT_CURRENCIES,
      ...availableCurrencies,
    ]);
    return Array.from(set);
  }, [availableCurrencies]);

  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      data-testid="net-worth-currency-selector"
    >
      <span className="mr-1 text-xs font-medium text-text-muted">
        {t('baseCurrency')}:
      </span>
      {currenciesList.map((currency) => {
        const isActive = currency === activeCurrency;

        return (
          <button
            key={currency}
            type="button"
            onClick={() => onSelectCurrency(currency)}
            className={clsx(
              'flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
              'border',
              isActive
                ? 'border-primary/50 bg-primary/10 text-primary shadow-xs dark:bg-primary/20'
                : 'border-fg/10 bg-surface/50 text-text-muted hover:border-fg/20 hover:text-foreground',
            )}
          >
            {currency}
          </button>
        );
      })}
    </div>
  );
};
