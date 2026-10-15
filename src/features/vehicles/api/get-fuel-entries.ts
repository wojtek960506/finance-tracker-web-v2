import { api } from '@shared/api';

import type { GetFuelEntriesQuery, VehicleFuelWithSummaryResponse } from './types';

export const getFuelEntries = async (
  vehicleId: string,
  query?: GetFuelEntriesQuery,
): Promise<VehicleFuelWithSummaryResponse> => {
  const res = await api.get<VehicleFuelWithSummaryResponse>(
    `/vehicles/${vehicleId}/fuel`,
    {
      params: query,
    },
  );
  return res.data;
};
