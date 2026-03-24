import { api } from '@shared/api';

import type { Transaction } from './types';

export const getTransaction = async (id: string): Promise<Transaction> => {
  const res = await api.get<Transaction>(`/transactions/${id}`);
  return res.data;
};
