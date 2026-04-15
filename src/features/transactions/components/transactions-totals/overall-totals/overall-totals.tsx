import { useTranslation } from 'react-i18next';

import type { TransactionTotalsOverall } from '@transactions/api';

import { OverallTotalsCard } from '../overall-totals-card';

export const OverallTotals = ({ overall }: { overall: TransactionTotalsOverall }) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3">
      <OverallTotalsCard label={t('totalItems')} value={overall.totalItems} />
      <OverallTotalsCard
        label={t('expenseItems')}
        value={overall.expense.totalItems}
        variant="expense"
      />
      <OverallTotalsCard
        label={t('incomeItems')}
        value={overall.income.totalItems}
        variant="income"
      />
    </div>
  );
};
