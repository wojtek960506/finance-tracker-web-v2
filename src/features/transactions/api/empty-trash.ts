import { api } from '@shared/api';

import type { DeleteManyReply } from './types';

export const emptyTrash = async (): Promise<DeleteManyReply> => {
  const res = await api.delete<DeleteManyReply>('/transactions/trash');
  return res.data;
};
