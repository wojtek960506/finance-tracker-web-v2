import { api } from '@shared/api';

import type {
  GetNetWorthIndependenceParams,
  NetWorthIndependenceResponseDTO,
} from './types';

export const getNetWorthIndependence = async (
  params?: GetNetWorthIndependenceParams,
): Promise<NetWorthIndependenceResponseDTO> => {
  const res = await api.get<NetWorthIndependenceResponseDTO>('/net-worth/independence', {
    params,
  });
  return res.data;
};
