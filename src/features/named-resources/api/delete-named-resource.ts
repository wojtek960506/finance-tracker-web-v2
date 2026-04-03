import { api } from '@shared/api';

import { type NamedResourceKind } from './types';

type DeleteResponse = {
  acknowledged: boolean;
  deletedCount: number;
};

export const deleteNamedResource = async (kind: NamedResourceKind, id: string) => {
  const res = await api.delete<DeleteResponse>(`/${kind}/${id}`);
  return res.data;
};
