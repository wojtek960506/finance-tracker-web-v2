import { api } from '@shared/api';

import type { UpdateVehiclePayload, Vehicle } from './types';

export const updateVehicle = async (
  vehicleId: string,
  payload: UpdateVehiclePayload,
): Promise<Vehicle> => {
  const res = await api.patch<Vehicle>(`/vehicles/${vehicleId}`, payload);
  return res.data;
};
