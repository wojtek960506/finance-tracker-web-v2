import { api } from '@shared/api';

import type { Transaction, TransactionInvestmentDTO } from './types';

export const updateInvestmentTransaction = async (
  id: string,
  payload: TransactionInvestmentDTO,
): Promise<Transaction> => {
  const res = await api.put<Transaction>(`/transactions/investment/${id}`, payload);
  return res.data;
};
