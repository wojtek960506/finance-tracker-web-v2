import { api } from '@shared/api';

import type { Transaction, TransactionExchangeDTO } from './types';

export const updateExchangeTransaction = async (
  id: string,
  payload: TransactionExchangeDTO,
): Promise<[Transaction, Transaction]> => {
  const res = await api.put<[Transaction, Transaction]>(
    `/transactions/exchange/${id}`,
    payload,
  );
  return res.data;
};
