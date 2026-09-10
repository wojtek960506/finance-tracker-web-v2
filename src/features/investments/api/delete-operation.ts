import { api } from '@shared/api';

export type DeleteOperationResponse = {
  acknowledged?: boolean;
  deletedCount?: number;
};

export const deleteOperation = async (id: string): Promise<DeleteOperationResponse> => {
  const res = await api.delete<DeleteOperationResponse>(`/investments/operations/${id}`);
  return res.data;
};
