import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionTotalsByCurrency } from '@transactions/api';
import { formatCurrencyAmount } from '@transactions/utils/currency-amount';

type TotalsMetricKey =
  | 'totalItems'
  | 'totalAmount'
  | 'averageAmount'
  | 'maxAmount'
  | 'minAmount';

const totalsMetricKeys: TotalsMetricKey[] = [
  'totalItems',
  'totalAmount',
  'averageAmount',
  'maxAmount',
  'minAmount',
];

export const CurrencyTotalsMetricsRows = ({
  currency,
  totals,
}: {
  currency: string;
  totals: TransactionTotalsByCurrency;
}) => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();

  return (
    <>
      {totalsMetricKeys.map((metricKey, index) => {
        const expenseValue =
          metricKey === 'totalItems'
            ? totals.expense.totalItems
            : formatCurrencyAmount(totals.expense[metricKey], currency, language);
        const incomeValue =
          metricKey === 'totalItems'
            ? totals.income.totalItems
            : formatCurrencyAmount(totals.income[metricKey], currency, language);

        return (
          <div className="contents" key={metricKey}>
            <span
              className={clsx(
                'currency-totals-metric-label font-medium text-text',
                index > 0 && 'currency-totals-metric-label-with-divider',
              )}
            >
              {t(metricKey)}
            </span>
            <span className={clsx('text-center font-semibold', 'text-destructive')}>
              {expenseValue}
            </span>
            <span className={clsx('text-center font-semibold', 'text-bt-primary')}>
              {incomeValue}
            </span>
          </div>
        );
      })}
    </>
  );
};
