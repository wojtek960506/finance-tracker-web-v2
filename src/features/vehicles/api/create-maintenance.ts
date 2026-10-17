import { api } from '@shared/api';

import type { CreateMaintenancePayload, VehicleMaintenance } from './types';

export const createMaintenance = async (
  vehicleId: string,
  payload: CreateMaintenancePayload,
): Promise<VehicleMaintenance> => {
  const res = await api.post<VehicleMaintenance>(
    `/vehicles/${vehicleId}/maintenance`,
    payload,
  );
  return res.data;
};
