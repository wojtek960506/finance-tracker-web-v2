import type { TransactionsResponse } from './types';

import { api } from '@/shared/api';

export const getTransactions = async (): Promise<TransactionsResponse> => {
  const params = new URLSearchParams({
    page: '1',
    limit: '30',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const res = await api.get(`/transactions?${params}`);
  return res.data;
};
