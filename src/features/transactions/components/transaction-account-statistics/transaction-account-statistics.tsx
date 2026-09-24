import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { useSettingsStore } from '@store/settings-store';
import { getAccountStatistics } from '@transactions/api';
import { LoadingCard } from '@ui';

import {
  getNormalizedTotalAmount,
  getTransactionAccountStatisticsQuery,
  TRANSACTION_ACCOUNT_STATISTICS_MAX_WIDTH,
} from './transaction-account-statistics.utils';
import { TransactionAccountStatisticsCurrencyGroup } from './transaction-account-statistics-currency-group';
import { TransactionAccountStatisticsEmptyState } from './transaction-account-statistics-empty-state';
import { TransactionAccountStatisticsHeader } from './transaction-account-statistics-header';

export const TransactionAccountStatistics = () => {
  const { t } = useTranslation('transactions');
  const [searchParams] = useSearchParams();
  const storeBaseCurrency = useSettingsStore((state) => state.baseCurrency);

  const accountStatisticsQuery = useMemo(() => {
    const query = getTransactionAccountStatisticsQuery(searchParams);
    return {
      ...query,
      baseCurrency: query.baseCurrency ?? storeBaseCurrency,
    };
  }, [searchParams, storeBaseCurrency]);

  const baseCurrency = accountStatisticsQuery.baseCurrency ?? storeBaseCurrency;

  const { data, isLoading, error } = useQuery({
    queryKey: ['transaction-account-statistics', accountStatisticsQuery],
    queryFn: async () => await getAccountStatistics(accountStatisticsQuery),
  });
  const normalizedTotalAmount = getNormalizedTotalAmount(data);

  if (isLoading)
    return (
      <LoadingCard
        title={t('loadingAccountStatistics')}
        description={t('loadingAccountStatisticsDescription')}
        widthClassName={TRANSACTION_ACCOUNT_STATISTICS_MAX_WIDTH}
      />
    );
  if (error) return <p className="text-destructive">{error.message}</p>;
  if (!data || data.currencies.length === 0)
    return <TransactionAccountStatisticsEmptyState />;

  return (
    <div
      className={clsx(
        'mx-auto flex w-full flex-col gap-4 overflow-y-auto sm:gap-6',
        TRANSACTION_ACCOUNT_STATISTICS_MAX_WIDTH,
      )}
    >
      <TransactionAccountStatisticsHeader
        baseCurrency={baseCurrency}
        normalizedTotalAmount={normalizedTotalAmount}
      />

      <div className="flex flex-col gap-4 sm:gap-6">
        {data.currencies.map((currencyGroup) => (
          <TransactionAccountStatisticsCurrencyGroup
            key={currencyGroup.currency}
            currencyGroup={currencyGroup}
            baseCurrency={baseCurrency}
          />
        ))}
      </div>
    </div>
  );
};
