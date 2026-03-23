import { BASE_URL } from '@shared/consts';

import type { Transaction } from './types';

export const getTransaction = async (
  authToken: string | null,
  id: string,
): Promise<Transaction> => {
  
  console.log('abc')

  const res = await fetch(`${BASE_URL}/api/transactions/${id}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) throw new Error('error getting transaction');

  return res.json();
};
