import { buildTransactionsApiSearchParams } from '@transactions/utils/transactions-query';

import type { GetTransactionsQuery, TransactionsResponse } from './types';

import { api } from '@/shared/api';

export const getTransactions = async (
  pageOrQuery: number | GetTransactionsQuery = 1,
): Promise<TransactionsResponse> => {
  const params =
    typeof pageOrQuery === 'number'
      ? buildTransactionsApiSearchParams({ page: pageOrQuery })
      : buildTransactionsApiSearchParams(pageOrQuery);

  const res = await api.get(`/transactions?${params}`);
  return res.data;
};
