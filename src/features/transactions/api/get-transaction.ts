import { api } from '@shared/api';

import type { TransactionDetails } from './types';

export const getTransaction = async (id: string): Promise<TransactionDetails> => {
  const res = await api.get<TransactionDetails>(`/transactions/${id}`);
  return res.data;
};
