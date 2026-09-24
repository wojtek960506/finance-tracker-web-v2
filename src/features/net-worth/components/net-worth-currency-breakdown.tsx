import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type { NetWorthCurrencyBreakdownDTO } from '../api';

import { NetWorthCurrencyCard } from './net-worth-currency-card';

type NetWorthCurrencyBreakdownProps = {
  currencies: NetWorthCurrencyBreakdownDTO[];
  baseCurrency: string;
};

export const NetWorthCurrencyBreakdown = ({
  currencies,
  baseCurrency,
}: NetWorthCurrencyBreakdownProps) => {
  const { t } = useTranslation('net-worth');
  const { language } = useLanguage();

  const sortedCurrencies = useMemo(() => {
    return [...currencies].sort((a, b) => {
      const aTotal = a.normalizedTotal ?? a.total;
      const bTotal = b.normalizedTotal ?? b.total;
      return bTotal - aTotal;
    });
  }, [currencies]);

  if (currencies.length === 0) return null;

  return (
    <Card className="flex flex-col gap-4 p-4" data-testid="net-worth-currency-breakdown">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
          {t('currencyBreakdown')}
        </h2>
        <p className="text-xs sm:text-sm text-text-muted">
          {t('currencyBreakdownDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCurrencies.map((item) => (
          <NetWorthCurrencyCard
            key={item.currency}
            item={item}
            baseCurrency={baseCurrency}
            language={language}
          />
        ))}
      </div>
    </Card>
  );
};
