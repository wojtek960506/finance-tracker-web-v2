import { api } from '@shared/api';

import type { VehicleFuelEntry } from './types';

export const getFuelEntry = async (
  vehicleId: string,
  entryId: string,
): Promise<VehicleFuelEntry> => {
  const res = await api.get<VehicleFuelEntry>(`/vehicles/${vehicleId}/fuel/${entryId}`);
  return res.data;
};
