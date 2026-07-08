import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { getAccountStatistics } from '@transactions/api';
import { LoadingCard } from '@ui';

import { TransactionAccountStatisticsCurrencyGroup } from './transaction-account-statistics-currency-group';
import { TransactionAccountStatisticsEmptyState } from './transaction-account-statistics-empty-state';
import { TransactionAccountStatisticsHeader } from './transaction-account-statistics-header';

// TODO split the remaining orchestration further if the statistics page grows again.
export const TransactionAccountStatistics = () => {
  const { t } = useTranslation('transactions');

  const { data, isLoading, error } = useQuery({
    queryKey: ['transaction-account-statistics'],
    queryFn: async () => await getAccountStatistics(),
  });

  if (isLoading) {
    return (
      <LoadingCard
        title={t('loadingAccountStatistics')}
        description={t('loadingAccountStatisticsDescription')}
        widthClassName="max-w-[70rem]"
      />
    );
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>;
  }

  if (!data || data.currencies.length === 0) {
    return <TransactionAccountStatisticsEmptyState />;
  }

  return (
    <div className="mx-auto flex w-full max-w-[70rem] flex-col gap-4 overflow-y-auto sm:gap-6">
      <TransactionAccountStatisticsHeader />

      <div className="flex flex-col gap-4 sm:gap-6">
        {data.currencies.map((currencyGroup) => (
          <TransactionAccountStatisticsCurrencyGroup
            key={currencyGroup.currency}
            currencyGroup={currencyGroup}
          />
        ))}
      </div>
    </div>
  );
};
