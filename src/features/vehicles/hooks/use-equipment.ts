import { useQuery } from '@tanstack/react-query';

import {
  getEquipment,
  type GetEquipmentQuery,
  type VehicleEquipmentListResponse,
} from '../api';
import { vehiclesQueryKeys } from '../consts';

export const useEquipment = (vehicleId: string, query?: GetEquipmentQuery) => {
  return useQuery<VehicleEquipmentListResponse, Error>({
    queryKey: vehiclesQueryKeys.equipment(vehicleId, query),
    queryFn: () => getEquipment(vehicleId, query),
    enabled: Boolean(vehicleId),
  });
};
