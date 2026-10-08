import { api } from '@shared/api';

export const deleteEquipment = async (
  vehicleId: string,
  equipmentId: string,
): Promise<void> => {
  await api.delete(`/vehicles/${vehicleId}/equipment/${equipmentId}`);
};
