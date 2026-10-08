import { api } from '@shared/api';

import type { GetEquipmentQuery, VehicleEquipmentListResponse } from './types';

export const getEquipment = async (
  vehicleId: string,
  query?: GetEquipmentQuery,
): Promise<VehicleEquipmentListResponse> => {
  const res = await api.get<VehicleEquipmentListResponse>(
    `/vehicles/${vehicleId}/equipment`,
    { params: query },
  );
  return res.data;
};
