import { api } from '@shared/api';

import type { Transaction, TransactionStandardCreateDTO } from './types';

export const createStandardTransaction = async (
  payload: TransactionStandardCreateDTO,
): Promise<Transaction> => {
  const res = await api.post<Transaction>('/transactions/standard', payload);
  return res.data;
};
