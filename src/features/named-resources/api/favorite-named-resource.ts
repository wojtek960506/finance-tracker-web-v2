import { api } from '@shared/api';

import type { INamedResource, NamedResourceKind } from './types';

export const favoriteNamedResource = async (
  kind: NamedResourceKind,
  id: string,
): Promise<INamedResource> => {
  const res = await api.post<INamedResource>(`/${kind}/${id}/favorite`);
  return res.data;
};
