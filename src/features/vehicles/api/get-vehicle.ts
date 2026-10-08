import { api } from '@shared/api';

import type { Vehicle } from './types';

export const getVehicle = async (vehicleId: string): Promise<Vehicle> => {
  const res = await api.get<Vehicle>(`/vehicles/${vehicleId}`);
  return res.data;
};
