import { api } from '@shared/api';

import type { VehicleEquipment } from './types';

export const getEquipmentItem = async (
  vehicleId: string,
  equipmentId: string,
): Promise<VehicleEquipment> => {
  const res = await api.get<VehicleEquipment>(
    `/vehicles/${vehicleId}/equipment/${equipmentId}`,
  );
  return res.data;
};
