import { api } from '@shared/api';

import type { Transaction, TransactionTransferCreateDTO } from './types';

export const createTransferTransaction = async (
  payload: TransactionTransferCreateDTO,
): Promise<[Transaction, Transaction]> => {
  const res = await api.post<[Transaction, Transaction]>(
    '/transactions/transfer',
    payload,
  );
  return res.data;
};
