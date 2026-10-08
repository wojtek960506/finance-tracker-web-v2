import { api } from '@shared/api';

import type { CreateEquipmentPayload, VehicleEquipment } from './types';

export const createEquipment = async (
  vehicleId: string,
  payload: CreateEquipmentPayload,
): Promise<VehicleEquipment> => {
  const res = await api.post<VehicleEquipment>(
    `/vehicles/${vehicleId}/equipment`,
    payload,
  );
  return res.data;
};
