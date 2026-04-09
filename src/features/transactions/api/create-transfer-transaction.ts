import { api } from '@shared/api';

import type { Transaction, TransactionTransferDTO } from './types';

export const createTransferTransaction = async (
  payload: TransactionTransferDTO,
): Promise<[Transaction, Transaction]> => {
  const res = await api.post<[Transaction, Transaction]>(
    '/transactions/transfer',
    payload,
  );
  return res.data;
};
