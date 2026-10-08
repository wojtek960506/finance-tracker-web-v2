import { api } from '@shared/api';

import type { GetFuelEntriesQuery, VehicleFuelEntryListResponse } from './types';

export const getFuelEntries = async (
  vehicleId: string,
  query?: GetFuelEntriesQuery,
): Promise<VehicleFuelEntryListResponse> => {
  const res = await api.get<VehicleFuelEntryListResponse>(`/vehicles/${vehicleId}/fuel`, {
    params: query,
  });
  return res.data;
};
