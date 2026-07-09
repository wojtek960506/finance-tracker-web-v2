import type {
  TransactionAccountStatisticsQuery,
  TransactionAccountStatisticsResponse,
} from '../types';

import { api } from '@/shared/api';

const buildSearchParams = (query: TransactionAccountStatisticsQuery = {}) => {
  const searchParams = new URLSearchParams();

  if (query.startDate) searchParams.set('startDate', query.startDate);
  if (query.endDate) searchParams.set('endDate', query.endDate);
  if (query.transactionType) searchParams.set('transactionType', query.transactionType);
  if (query.currency) searchParams.set('currency', query.currency.toUpperCase());
  if (query.baseCurrency) {
    searchParams.set('baseCurrency', query.baseCurrency.trim().toUpperCase());
  }

  return searchParams;
};

export const getAccountStatistics = async (
  query: TransactionAccountStatisticsQuery = {},
): Promise<TransactionAccountStatisticsResponse> => {
  const searchParams = buildSearchParams(query);
  const url = searchParams.size
    ? `/transactions/statistics/accounts?${searchParams.toString()}`
    : '/transactions/statistics/accounts';

  const res = await api.get<TransactionAccountStatisticsResponse>(url);

  return res.data;
};
