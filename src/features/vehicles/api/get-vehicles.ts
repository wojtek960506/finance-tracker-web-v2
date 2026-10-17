import { api } from '@shared/api';

import type { VehicleListResponse } from './types';

export const getVehicles = async (): Promise<VehicleListResponse> => {
  const res = await api.get<VehicleListResponse>('/vehicles');
  return res.data;
};
