import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  getAccountStatistics,
  type TransactionAccountStatisticsQuery,
  type TransactionType,
} from '@transactions/api';
import { LoadingCard } from '@ui';

import { TransactionAccountStatisticsCurrencyGroup } from './transaction-account-statistics-currency-group';
import { TransactionAccountStatisticsEmptyState } from './transaction-account-statistics-empty-state';
import { TransactionAccountStatisticsHeader } from './transaction-account-statistics-header';

const MAX_WIDTH = clsx(
  "max-w-[44rem] md:max-w-[56rem] lg:max-w-[72rem] xl:max-w-[88rem] 2xl:max-w-[104rem]",
  "3xl:max-w-[128rem]",
);

const DEFAULT_BASE_CURRENCY = 'PLN';

const normalizeCurrencyCode = (value: string | null, fallback?: string) =>
  value?.trim().toUpperCase() || fallback;

const getTransactionAccountStatisticsQuery = (
  searchParams: URLSearchParams,
): TransactionAccountStatisticsQuery => ({
  startDate: searchParams.get('startDate') || undefined,
  endDate: searchParams.get('endDate') || undefined,
  transactionType: (() => {
    const value = searchParams.get('transactionType');

    if (value === 'expense' || value === 'income') {
      return value as TransactionType;
    }

    return undefined;
  })(),
  currency: normalizeCurrencyCode(searchParams.get('currency')),
  baseCurrency: normalizeCurrencyCode(searchParams.get('baseCurrency'), DEFAULT_BASE_CURRENCY),
});

// TODO split the remaining orchestration further if the statistics page grows again.
export const TransactionAccountStatistics = () => {
  const { t } = useTranslation('transactions');
  const [searchParams, setSearchParams] = useSearchParams();
  const accountStatisticsQuery = useMemo(
    () => getTransactionAccountStatisticsQuery(searchParams),
    [searchParams],
  );
  const baseCurrency = accountStatisticsQuery.baseCurrency ?? DEFAULT_BASE_CURRENCY;

  const handleBaseCurrencyChange = (nextBaseCurrency: string) => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);

      if (nextBaseCurrency) {
        nextSearchParams.set('baseCurrency', nextBaseCurrency);
      } else {
        nextSearchParams.set('baseCurrency', DEFAULT_BASE_CURRENCY);
      }

      return nextSearchParams;
    });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['transaction-account-statistics', accountStatisticsQuery],
    queryFn: async () => await getAccountStatistics(accountStatisticsQuery),
  });
  const normalizedTotalAmount =
    data?.normalizedTotalAmount ??
    data?.currencies.reduce(
      (total, currencyGroup) => total + (currencyGroup.normalizedTotalAmount ?? 0),
      0,
    );

  if (isLoading) {
    return (
      <LoadingCard
        title={t('loadingAccountStatistics')}
        description={t('loadingAccountStatisticsDescription')}
        widthClassName={MAX_WIDTH}
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
    <div className={clsx(
      "mx-auto flex w-full flex-col gap-4 overflow-y-auto sm:gap-6", MAX_WIDTH,
    )}>
      <TransactionAccountStatisticsHeader
        baseCurrency={baseCurrency}
        normalizedTotalAmount={normalizedTotalAmount}
        onBaseCurrencyChange={handleBaseCurrencyChange}
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
