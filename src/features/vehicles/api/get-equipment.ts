import { api } from '@shared/api';

import type { GetEquipmentQuery, VehicleEquipmentWithSummaryResponse } from './types';

export const getEquipment = async (
  vehicleId: string,
  query?: GetEquipmentQuery,
): Promise<VehicleEquipmentWithSummaryResponse> => {
  const res = await api.get<VehicleEquipmentWithSummaryResponse>(
    `/vehicles/${vehicleId}/equipment`,
    { params: query },
  );
  return res.data;
};
