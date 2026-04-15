import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionFilters } from '@transactions/api';
import { getTransactionTotals } from '@transactions/api';
import { Card } from '@ui';

import { CurrencyTotalsCard } from './currency-totals-card';

type TransactionsTotalsPanelProps = {
  filters: TransactionFilters;
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
