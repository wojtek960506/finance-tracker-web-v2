import { useTranslation } from 'react-i18next';

import type { TransactionTotalsResponse } from '@transactions/api';

import { CurrencyTotalsCard } from './currency-totals-card';

type CurrenciesTotalsProps = {
  byCurrency: TransactionTotalsResponse['byCurrency'];
};

export const CurrenciesTotals = ({ byCurrency }: CurrenciesTotalsProps) => {
  const { t } = useTranslation('transactions');

  const sortedCurrencyTotals = Object.entries(byCurrency).sort(
    (left, right) => right[1].totalItems - left[1].totalItems,
  );

  if (sortedCurrencyTotals.length === 0) {
    return <p className="text-sm text-text-muted">{t('noCurrencyTotals')}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedCurrencyTotals.map(([currency, totals]) => (
        <CurrencyTotalsCard key={currency} currency={currency} totals={totals} />
      ))}
    </div>
  );
};
