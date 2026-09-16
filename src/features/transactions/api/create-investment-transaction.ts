import { api } from '@shared/api';

import type { Transaction, TransactionInvestmentDTO } from './types';

export const createInvestmentTransaction = async (
  payload: TransactionInvestmentDTO,
): Promise<Transaction> => {
  const res = await api.post<Transaction>('/transactions/investment', payload);
  return res.data;
};
