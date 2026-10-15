import { useQuery } from '@tanstack/react-query';

import {
  getMaintenance,
  type GetMaintenanceQuery,
  type VehicleMaintenanceListResponse,
} from '../api';
import { vehiclesQueryKeys } from '../consts';

export const useMaintenance = (vehicleId: string, query?: GetMaintenanceQuery) => {
  return useQuery<VehicleMaintenanceListResponse, Error>({
    queryKey: vehiclesQueryKeys.maintenance(vehicleId, query),
    queryFn: () => getMaintenance(vehicleId, query),
    enabled: Boolean(vehicleId),
  });
};
