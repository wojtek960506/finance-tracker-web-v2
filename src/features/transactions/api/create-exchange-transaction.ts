import { api } from '@shared/api';

import type { Transaction, TransactionExchangeCreateDTO } from './types';

export const createExchangeTransaction = async (
  payload: TransactionExchangeCreateDTO,
): Promise<[Transaction, Transaction]> => {
  const res = await api.post<[Transaction, Transaction]>(
    '/transactions/exchange',
    payload,
  );
  return res.data;
};
