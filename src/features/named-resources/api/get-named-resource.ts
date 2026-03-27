import type { INamedResource, NamedResourceKind } from './types';

import { api } from '@/shared/api';

export const getNamedResource = async (
  kind: NamedResourceKind,
): Promise<INamedResource> => {
  const res = await api.get<INamedResource>(`/${kind}`);
  return res.data;
};
