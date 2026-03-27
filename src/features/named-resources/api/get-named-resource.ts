import type { INamedResource, NamedResourceName } from './types';

import { api } from '@/shared/api';

export const getNamedResource = async (
  name: NamedResourceName,
): Promise<INamedResource> => {
  const res = await api.get<INamedResource>(`/${name}`);
  return res.data;
};
