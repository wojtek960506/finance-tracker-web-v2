import { api } from '@shared/api';

import type { UpdateManyReply } from './types';

export const moveTransactionToTrash = async (id: string): Promise<UpdateManyReply> => {
  const res = await api.delete<UpdateManyReply>(`/transactions/${id}`);
  return res.data;
};
