import { api } from '@shared/api';

export const deleteFuelEntry = async (
  vehicleId: string,
  entryId: string,
): Promise<void> => {
  await api.delete(`/vehicles/${vehicleId}/fuel/${entryId}`);
};
