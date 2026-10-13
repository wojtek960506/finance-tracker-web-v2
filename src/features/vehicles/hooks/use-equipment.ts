import { useQuery } from '@tanstack/react-query';

import { getEquipment } from '../api';
import { vehiclesQueryKeys } from '../consts';
import type { GetEquipmentQuery, VehicleEquipmentListResponse } from '../types';

export const useEquipment = (vehicleId: string, query?: GetEquipmentQuery) => {
  return useQuery<VehicleEquipmentListResponse, Error>({
    queryKey: vehiclesQueryKeys.equipment(vehicleId, query),
    queryFn: () => getEquipment(vehicleId, query),
    enabled: Boolean(vehicleId),
  });
};
