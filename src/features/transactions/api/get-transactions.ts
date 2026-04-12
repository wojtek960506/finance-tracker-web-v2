import type { TransactionsResponse } from './types';

import { api } from '@/shared/api';

export const getTransactions = async (page = 1): Promise<TransactionsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: '30',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const res = await api.get(`/transactions?${params}`);
  return res.data;
};
