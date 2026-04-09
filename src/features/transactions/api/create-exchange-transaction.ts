import { api } from '@shared/api';

import type { Transaction, TransactionExchangeDTO } from './types';

export const createExchangeTransaction = async (
  payload: TransactionExchangeDTO,
): Promise<[Transaction, Transaction]> => {
  const res = await api.post<[Transaction, Transaction]>(
    '/transactions/exchange',
    payload,
  );
  return res.data;
};
