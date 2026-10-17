import { api } from '@shared/api';

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
  await api.delete(`/vehicles/${vehicleId}`);
};
