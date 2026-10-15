import { api } from '@shared/api';

import type { GetMaintenanceQuery, VehicleMaintenanceWithSummaryResponse } from './types';

export const getMaintenance = async (
  vehicleId: string,
  query?: GetMaintenanceQuery,
): Promise<VehicleMaintenanceWithSummaryResponse> => {
  const res = await api.get<VehicleMaintenanceWithSummaryResponse>(
    `/vehicles/${vehicleId}/maintenance`,
    { params: query },
  );
  return res.data;
};
