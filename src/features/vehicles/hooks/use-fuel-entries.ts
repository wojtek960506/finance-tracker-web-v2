import { useQuery } from '@tanstack/react-query';

import {
  getFuelEntries,
  type GetFuelEntriesQuery,
  type VehicleFuelWithSummaryResponse,
} from '../api';
import { vehiclesQueryKeys } from '../consts';

export const useFuelEntries = (vehicleId: string, query?: GetFuelEntriesQuery) => {
  return useQuery<VehicleFuelWithSummaryResponse, Error>({
    queryKey: vehiclesQueryKeys.fuel(vehicleId, query),
    queryFn: () => getFuelEntries(vehicleId, query),
    enabled: Boolean(vehicleId),
  });
};
