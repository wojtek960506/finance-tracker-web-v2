import { api } from '@shared/api';

import type { UpdateManyReply } from './types';

export const restoreTransaction = async (id: string): Promise<UpdateManyReply> => {
  const res = await api.post<UpdateManyReply>(`/transactions/trash/${id}/restore`);
  return res.data;
};
