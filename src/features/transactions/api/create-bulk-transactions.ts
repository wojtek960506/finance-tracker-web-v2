import { api } from '@shared/api';

import type { CreateBulkTransactionsDTO, Transaction } from './types';

export const createBulkTransactions = async (
  payload: CreateBulkTransactionsDTO,
): Promise<Transaction[]> => {
  const res = await api.post<Transaction[]>('/transactions/bulk', payload);
  return res.data;
};
