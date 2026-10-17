import { api } from '@shared/api';

import type { CreateFuelEntryPayload, VehicleFuelEntry } from './types';

export const createFuelEntry = async (
  vehicleId: string,
  payload: CreateFuelEntryPayload,
): Promise<VehicleFuelEntry> => {
  const res = await api.post<VehicleFuelEntry>(`/vehicles/${vehicleId}/fuel`, payload);
  return res.data;
};
