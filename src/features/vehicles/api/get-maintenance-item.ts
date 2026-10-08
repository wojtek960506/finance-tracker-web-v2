import { api } from '@shared/api';

import type { VehicleMaintenance } from './types';

export const getMaintenanceItem = async (
  vehicleId: string,
  maintenanceId: string,
): Promise<VehicleMaintenance> => {
  const res = await api.get<VehicleMaintenance>(
    `/vehicles/${vehicleId}/maintenance/${maintenanceId}`,
  );
  return res.data;
};
