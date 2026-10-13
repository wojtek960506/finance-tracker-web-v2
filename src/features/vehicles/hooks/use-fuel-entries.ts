import { useQuery } from '@tanstack/react-query';

import { getFuelEntries } from '../api';
import { vehiclesQueryKeys } from '../consts';
import type { GetFuelEntriesQuery, VehicleFuelEntryListResponse } from '../types';

export const useFuelEntries = (vehicleId: string, query?: GetFuelEntriesQuery) => {
  return useQuery<VehicleFuelEntryListResponse, Error>({
    queryKey: vehiclesQueryKeys.fuel(vehicleId, query),
    queryFn: () => getFuelEntries(vehicleId, query),
    enabled: Boolean(vehicleId),
  });
};
