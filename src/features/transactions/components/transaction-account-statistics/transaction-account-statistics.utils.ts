import clsx from 'clsx';

import type {
  TransactionAccountStatisticsQuery,
  TransactionAccountStatisticsResponse,
  TransactionType,
} from '@transactions/api';

export const TRANSACTION_ACCOUNT_STATISTICS_MAX_WIDTH = clsx(
  'max-w-[44rem] md:max-w-[56rem] lg:max-w-[72rem] xl:max-w-[88rem] 2xl:max-w-[104rem]',
  '3xl:max-w-[128rem]',
);

export const DEFAULT_BASE_CURRENCY = 'PLN';

const normalizeCurrencyCode = (value: string | null, fallback?: string) =>
  value?.trim().toUpperCase() || fallback;

const getTransactionType = (value: string | null): TransactionType | undefined => {
  if (value === 'expense' || value === 'income') {
    return value;
  }

  return undefined;
};

export const getTransactionAccountStatisticsQuery = (
  searchParams: URLSearchParams,
): TransactionAccountStatisticsQuery => ({
  startDate: searchParams.get('startDate') || undefined,
  endDate: searchParams.get('endDate') || undefined,
  transactionType: getTransactionType(searchParams.get('transactionType')),
  currency: normalizeCurrencyCode(searchParams.get('currency')),
  baseCurrency: normalizeCurrencyCode(
    searchParams.get('baseCurrency'),
    DEFAULT_BASE_CURRENCY,
  ),
});

export const setTransactionAccountStatisticsBaseCurrency = (
  searchParams: URLSearchParams,
  baseCurrency: string,
) => {
  const nextSearchParams = new URLSearchParams(searchParams);

  nextSearchParams.set(
    'baseCurrency',
    normalizeCurrencyCode(baseCurrency, DEFAULT_BASE_CURRENCY) ?? DEFAULT_BASE_CURRENCY,
  );

  return nextSearchParams;
};

export const getNormalizedTotalAmount = (data?: TransactionAccountStatisticsResponse) =>
  data?.normalizedTotalAmount ??
  data?.currencies.reduce(
    (total, currencyGroup) => total + (currencyGroup.normalizedTotalAmount ?? 0),
    0,
  );
