import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

type PortfolioCurrencyPillsProps = {
  currencies: string[];
  activeCurrency: string | null;
  onSelectCurrency: (currency: string) => void;
};

export const PortfolioCurrencyPills = ({
  currencies,
  activeCurrency,
  onSelectCurrency,
}: PortfolioCurrencyPillsProps) => {
  const { t } = useTranslation('investments');

  if (currencies.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-text-muted">
        {t('portfolio.currencySelector')}:
      </span>
      {currencies.map((currency) => {
        const isSelected = currency === activeCurrency;

        return (
          <Button
            key={currency}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => onSelectCurrency(currency)}
            className={clsx(
              'h-8 px-3 text-xs font-semibold uppercase tracking-wider',
              isSelected && 'shadow-sm',
            )}
          >
            {currency}
          </Button>
        );
      })}
    </div>
  );
};
