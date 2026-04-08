import { api } from '@shared/api';

import type { Transaction, TransactionStandardDTO } from './types';

export const updateStandardTransaction = async (
  id: string,
  payload: TransactionStandardDTO,
): Promise<Transaction> => {
  const res = await api.put<Transaction>(`/transactions/standard/${id}`, payload);
  return res.data;
};
