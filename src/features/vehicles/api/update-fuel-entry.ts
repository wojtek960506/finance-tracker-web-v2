import { api } from '@shared/api';

import type { UpdateFuelEntryPayload, VehicleFuelEntry } from './types';

export const updateFuelEntry = async (
  vehicleId: string,
  entryId: string,
  payload: UpdateFuelEntryPayload,
): Promise<VehicleFuelEntry> => {
  const res = await api.patch<VehicleFuelEntry>(
    `/vehicles/${vehicleId}/fuel/${entryId}`,
    payload,
  );
  return res.data;
};
