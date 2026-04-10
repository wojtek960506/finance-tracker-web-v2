import { api } from '@shared/api';

import type { TrashedTransactionDetails } from './types';

export const getTrashedTransaction = async (
  id: string,
): Promise<TrashedTransactionDetails> => {
  const res = await api.get<TrashedTransactionDetails>(`/transactions/trash/${id}`);
  return res.data;
};
