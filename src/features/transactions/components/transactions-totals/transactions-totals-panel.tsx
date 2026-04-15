import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import type { TransactionFilters } from '@transactions/api';
import { getTransactionTotals } from '@transactions/api';
import { Card } from '@ui';

import { CurrenciesTotals } from './currencies-totals';
import { OverallTotals } from './overall-totals';

type TransactionsTotalsPanelProps = {
  filters: TransactionFilters;
};

export const TransactionsTotalsPanel = ({ filters }: TransactionsTotalsPanelProps) => {
  const { t } = useTranslation('transactions');

  const { data, isLoading, error } = useQuery({
    queryKey: ['transaction-totals', filters],
    queryFn: async () => await getTransactionTotals(filters),
  });

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
          <OverallTotals overall={data.overall} />
          <CurrenciesTotals byCurrency={data.byCurrency} />
        </div>
      ) : null}
    </Card>
  );
};
