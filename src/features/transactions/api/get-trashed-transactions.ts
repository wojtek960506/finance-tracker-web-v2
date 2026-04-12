import type { TrashedTransactionsResponse } from './types';

import { api } from '@/shared/api';

export const getTrashedTransactions = async (
  page = 1,
): Promise<TrashedTransactionsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: '30',
    sortBy: 'deletedAt',
    sortOrder: 'desc',
  });

  const res = await api.get(`/transactions/trash?${params}`);
  return res.data;
};
