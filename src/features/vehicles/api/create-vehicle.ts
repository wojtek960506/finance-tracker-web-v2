import { api } from '@shared/api';

import type { CreateVehiclePayload, Vehicle } from './types';

export const createVehicle = async (payload: CreateVehiclePayload): Promise<Vehicle> => {
  const res = await api.post<Vehicle>('/vehicles', payload);
  return res.data;
};
