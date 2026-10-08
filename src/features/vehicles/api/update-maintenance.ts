import { api } from '@shared/api';

import type { UpdateMaintenancePayload, VehicleMaintenance } from './types';

export const updateMaintenance = async (
  vehicleId: string,
  maintenanceId: string,
  payload: UpdateMaintenancePayload,
): Promise<VehicleMaintenance> => {
  const res = await api.patch<VehicleMaintenance>(
    `/vehicles/${vehicleId}/maintenance/${maintenanceId}`,
    payload,
  );
  return res.data;
};
