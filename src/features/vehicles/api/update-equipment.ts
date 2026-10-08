import { api } from '@shared/api';

import type { UpdateEquipmentPayload, VehicleEquipment } from './types';

export const updateEquipment = async (
  vehicleId: string,
  equipmentId: string,
  payload: UpdateEquipmentPayload,
): Promise<VehicleEquipment> => {
  const res = await api.patch<VehicleEquipment>(
    `/vehicles/${vehicleId}/equipment/${equipmentId}`,
    payload,
  );
  return res.data;
};
