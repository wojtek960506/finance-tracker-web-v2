import { api } from '@shared/api';

import type { DeleteManyReply } from './types';

export const deleteTrashedTransaction = async (id: string): Promise<DeleteManyReply> => {
  const res = await api.delete<DeleteManyReply>(`/transactions/trash/${id}`);
  return res.data;
};
