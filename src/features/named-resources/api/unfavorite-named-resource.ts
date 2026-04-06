import { api } from '@shared/api';

import type { DeleteResponse, NamedResourceKind } from './types';

export const unfavoriteNamedResource = async (
  kind: NamedResourceKind,
  id: string,
): Promise<DeleteResponse> => {
  const res = await api.delete<DeleteResponse>(`/${kind}/${id}/favorite`);
  return res.data;
};
