import { BASE_URL } from '@shared/consts';

import type { TransactionsResponse } from './types';



export const getTransactions = async (
  authToken: string | null,
): Promise<TransactionsResponse> => {
  const params = new URLSearchParams({
    page: '1',
    limit: '30',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const res = await fetch(`${BASE_URL}/api/transactions?${params}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) throw new Error('error getting transactions');

  return res.json();
};
