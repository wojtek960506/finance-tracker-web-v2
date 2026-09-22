import { api } from '@shared/api';

import type { GetNetWorthParams, NetWorthResponseDTO } from './types';

export const getNetWorth = async (
  params?: GetNetWorthParams,
): Promise<NetWorthResponseDTO> => {
  const res = await api.get<NetWorthResponseDTO>('/net-worth', {
    params,
  });
  return res.data;
};
