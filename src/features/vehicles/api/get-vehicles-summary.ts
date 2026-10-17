import { api } from '@shared/api';

import type { VehiclesSummaryResponse } from './types';

export const getVehiclesSummary = async (): Promise<VehiclesSummaryResponse> => {
  const res = await api.get<VehiclesSummaryResponse>('/vehicles/summary');
  return res.data;
};
