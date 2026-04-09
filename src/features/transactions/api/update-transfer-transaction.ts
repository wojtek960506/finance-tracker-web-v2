import { api } from '@shared/api';

import type { Transaction, TransactionTransferDTO } from './types';

export const updateTransferTransaction = async (
  id: string,
  payload: TransactionTransferDTO,
): Promise<[Transaction, Transaction]> => {
  const res = await api.put<[Transaction, Transaction]>(
    `/transactions/transfer/${id}`,
    payload,
  );
  return res.data;
};
