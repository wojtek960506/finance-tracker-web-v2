import { api } from '@shared/api';

import type { INamedResource, NamedResourceName } from './types';

export const getNamedResources = async (
  name: NamedResourceName,
): Promise<INamedResource[]> => {
  const res = await api.get<INamedResource[]>(`/${name}`);
  return res.data;
};
