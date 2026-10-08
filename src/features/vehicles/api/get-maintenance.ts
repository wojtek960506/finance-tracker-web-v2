import { api } from '@shared/api';

import type { GetMaintenanceQuery, VehicleMaintenanceListResponse } from './types';

export const getMaintenance = async (
  vehicleId: string,
  query?: GetMaintenanceQuery,
): Promise<VehicleMaintenanceListResponse> => {
  const res = await api.get<VehicleMaintenanceListResponse>(
    `/vehicles/${vehicleId}/maintenance`,
    { params: query },
  );
  return res.data;
};
