import { api } from '@shared/api';

import type { Transaction, TransactionStandardDTO } from './types';

export const createStandardTransaction = async (
  payload: TransactionStandardDTO,
): Promise<Transaction> => {
  const res = await api.post<Transaction>('/transactions/standard', payload);
  return res.data;
};
