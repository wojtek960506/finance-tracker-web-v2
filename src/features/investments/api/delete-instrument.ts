import { api } from '@shared/api';

export type DeleteInstrumentResponse = {
  acknowledged?: boolean;
  deletedCount?: number;
};

export const deleteInstrument = async (id: string): Promise<DeleteInstrumentResponse> => {
  const res = await api.delete<DeleteInstrumentResponse>(
    `/investments/instruments/${id}`,
  );
  return res.data;
};
