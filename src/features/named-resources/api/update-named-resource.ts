import { api } from '@shared/api';

import { type INamedResource, type NamedResourceKind } from './types';

export const updateNamedResource = async (
  kind: NamedResourceKind,
  id: string,
  name: string,
) => {
  const res = await api.put<INamedResource>(`/${kind}/${id}`, { name });
  return res.data;
};
