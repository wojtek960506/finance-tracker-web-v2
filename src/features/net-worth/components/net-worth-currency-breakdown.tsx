import clsx from 'clsx';
import { Landmark, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { Card } from '@shared/ui';

import type { NetWorthCurrencyBreakdownDTO } from '../api';
import { formatCurrencyAmount } from '../utils';

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

  return (
    <div className="flex flex-col gap-3" data-testid="net-worth-currency-breakdown">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
          {t('currencyBreakdown')}
        </h2>
        <p className="text-xs text-text-muted">{t('currencyBreakdownDescription')}</p>
      </div>

      {currencies.length === 0 ? (
        <Card className="p-6 text-center text-xs text-text-muted sm:text-sm">
          {t('noCurrenciesAvailable')}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {currencies.map((item) => {
            const showNormalized =
              item.normalizedTotal !== undefined && item.currency !== baseCurrency;

            return (
              <Card
                key={item.currency}
                className={clsx(
                  'flex flex-col justify-between gap-3 p-4',
                  item.currency === baseCurrency && 'border-primary/30',
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-fg/10 pb-2.5">
                  <span className="rounded-md bg-fg/10 px-2 py-0.5 text-xs font-bold text-foreground">
                    {item.currency}
                  </span>
                  {showNormalized && item.normalizedTotal !== undefined && (
                    <span className="text-xs font-medium text-text-muted">
                      ≈{' '}
                      {formatCurrencyAmount(item.normalizedTotal, baseCurrency, language)}
                    </span>
                  )}
                </div>

                {/* Total */}
                <div>
                  <div className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {formatCurrencyAmount(item.total, item.currency, language)}
                  </div>
                </div>

                {/* Breakdown Rows */}
                <div className="flex flex-col gap-1.5 pt-1 text-xs">
                  <div className="flex items-center justify-between text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Landmark className="size-3.5 text-emerald-500" />
                      <span>{t('liquidCash')}</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {formatCurrencyAmount(item.cash, item.currency, language)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="size-3.5 text-sky-500" />
                      <span>{t('investments')}</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {formatCurrencyAmount(item.investments, item.currency, language)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
