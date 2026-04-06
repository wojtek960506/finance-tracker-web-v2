import { api } from '@shared/api';

import { type DeleteResponse, type NamedResourceKind } from './types';

export const deleteNamedResource = async (kind: NamedResourceKind, id: string) => {
  const res = await api.delete<DeleteResponse>(`/${kind}/${id}`);
  return res.data;
};
