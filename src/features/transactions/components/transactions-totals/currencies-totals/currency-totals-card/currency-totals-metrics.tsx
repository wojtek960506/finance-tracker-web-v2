import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { TransactionTotalsByCurrency } from '@transactions/api';

import { CurrencyTotalsMetricsRows } from './currency-totals-metrics-rows';

export const CurrencyTotalsMetrics = ({
  currency,
  totals,
}: {
  currency: string;
  totals: TransactionTotalsByCurrency;
}) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="currency-totals-metrics-container">
      <div className="currency-totals-metrics-grid rounded-2xl border border-fg/10 bg-bg/65 p-3 text-sm">
        <span className="currency-totals-metrics-spacer text-text-muted" />
        <span className="flex items-center justify-center gap-1 font-semibold text-destructive">
          <ArrowDownLeft className="size-4" aria-hidden="true" />
          {t('expense')}
        </span>
        <span className="flex items-center justify-center gap-1 font-semibold text-bt-primary">
          <ArrowUpRight className="size-4" aria-hidden="true" />
          {t('income')}
        </span>
        <CurrencyTotalsMetricsRows currency={currency} totals={totals} />
      </div>
    </div>
  );
};
