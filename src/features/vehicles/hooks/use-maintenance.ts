import { useQuery } from '@tanstack/react-query';

import { getMaintenance } from '../api';
import { vehiclesQueryKeys } from '../consts';
import type { GetMaintenanceQuery, VehicleMaintenanceListResponse } from '../types';

export const useMaintenance = (vehicleId: string, query?: GetMaintenanceQuery) => {
  return useQuery<VehicleMaintenanceListResponse, Error>({
    queryKey: vehiclesQueryKeys.maintenance(vehicleId, query),
    queryFn: () => getMaintenance(vehicleId, query),
    enabled: Boolean(vehicleId),
  });
};
