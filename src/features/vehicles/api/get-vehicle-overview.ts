import { api } from '@shared/api';

import type { GetVehicleOverviewQuery, VehicleOverviewResponse } from './types';

export const getVehicleOverview = async (
  vehicleId: string,
  query?: GetVehicleOverviewQuery,
): Promise<VehicleOverviewResponse> => {
  const res = await api.get<VehicleOverviewResponse>(`/vehicles/${vehicleId}/overview`, {
    params: query,
  });
  return res.data;
};
