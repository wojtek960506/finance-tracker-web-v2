import { api } from '@shared/api';

export const deleteMaintenance = async (
  vehicleId: string,
  maintenanceId: string,
): Promise<void> => {
  await api.delete(`/vehicles/${vehicleId}/maintenance/${maintenanceId}`);
};
