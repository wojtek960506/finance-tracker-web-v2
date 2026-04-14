import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionFilters, TransactionTotalsByCurrency } from '@transactions/api';
import { getTransactionTotals } from '@transactions/api';
import { Card } from '@ui';

type TransactionsTotalsPanelProps = {
  filters: TransactionFilters;
};

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

const formatDecimal = (value: number, language: string) =>
  new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatCurrencyAmount = (value: number, currency: string, language: string) =>
  `${formatDecimal(value, language)} ${currency}`;

const CurrencyTotalsCard = ({
  currency,
  totals,
  language,
  t,
}: {
  currency: string;
  totals: TransactionTotalsByCurrency;
  language: string;
  t: (key: string) => string;
}) => {
  return (
    <Card className="gap-3 rounded-2xl border-fg/15 bg-bg/55 shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-semibold sm:text-xl">{currency}</h3>
          <span className="text-sm text-text-muted">{t('currency')}</span>
        </div>
        <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
          {t('totalItems')}: {totals.totalItems}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-fg/10 bg-bg/65 p-3 text-sm">
        <span className="text-text-muted" />
        <span className="flex items-center justify-center gap-1 font-semibold text-destructive">
          <ArrowDownLeft className="size-4" aria-hidden="true" />
          {t('expense')}
        </span>
        <span className="flex items-center justify-center gap-1 font-semibold text-bt-primary">
          <ArrowUpRight className="size-4" aria-hidden="true" />
          {t('income')}
        </span>

        {totalsMetricKeys.map((metricKey) => {
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
              <span className="font-medium text-text">{t(metricKey)}</span>
              <span
                className={clsx(
                  'text-center font-semibold',
                  metricKey === 'totalItems' ? 'text-text' : 'text-destructive',
                )}
              >
                {expenseValue}
              </span>
              <span
                className={clsx(
                  'text-center font-semibold',
                  metricKey === 'totalItems' ? 'text-text' : 'text-bt-primary',
                )}
              >
                {incomeValue}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export const TransactionsTotalsPanel = ({ filters }: TransactionsTotalsPanelProps) => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ['transaction-totals', filters],
    queryFn: async () => await getTransactionTotals(filters),
  });

  const sortedCurrencyTotals = Object.entries(data?.byCurrency ?? {}).sort(
    (left, right) => right[1].totalItems - left[1].totalItems,
  );

  return (
    <Card
      className={clsx(
        'w-full min-w-0 max-w-full gap-4 overflow-visible',
        'rounded-3xl border-fg/20 bg-modal-bg/95',
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold sm:text-xl">{t('totals')}</h2>
        <p className="text-sm text-text-muted">{t('totalsDescription')}</p>
      </div>

      {isLoading ? <p>{t('loadingTotals')}</p> : null}
      {error ? <p className="text-destructive">{error.message}</p> : null}

      {data ? (
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3">
            <Card className="gap-1 rounded-2xl border-fg/15 bg-bg/55 shadow-none">
              <span className="text-sm text-text-muted">{t('totalItems')}</span>
              <strong className="text-2xl font-semibold">
                {data.overall.totalItems}
              </strong>
            </Card>
            <Card className="gap-1 rounded-2xl border-destructive-border bg-destructive/8 shadow-none">
              <span className="text-sm text-destructive/80">{t('expenseItems')}</span>
              <strong className="text-2xl font-semibold text-destructive">
                {data.overall.expense.totalItems}
              </strong>
            </Card>
            <Card className="gap-1 rounded-2xl border-bt-primary/25 bg-bt-primary/8 shadow-none">
              <span className="text-sm text-bt-primary/80">{t('incomeItems')}</span>
              <strong className="text-2xl font-semibold text-bt-primary">
                {data.overall.income.totalItems}
              </strong>
            </Card>
          </div>

          {sortedCurrencyTotals.length > 0 ? (
            <div className="flex flex-col gap-3">
              {sortedCurrencyTotals.map(([currency, totals]) => (
                <CurrencyTotalsCard
                  key={currency}
                  currency={currency}
                  totals={totals}
                  language={language}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted">{t('noCurrencyTotals')}</p>
          )}
        </div>
      ) : null}
    </Card>
  );
};
