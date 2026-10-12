import type { Vehicle } from '@vehicles/api';
import { DEFAULT_VEHICLE_TYPE } from '@vehicles/consts';

import type { VehicleFormValues } from './types';

export const getDefaultVehicleFormValues = (
  vehicle?: Partial<Vehicle> | null,
): VehicleFormValues => ({
  name: vehicle?.name ?? '',
  slug: vehicle?.slug ?? '',
  brand: vehicle?.brand ?? '',
  vehicleModel: vehicle?.vehicleModel ?? '',
  type: vehicle?.type ?? DEFAULT_VEHICLE_TYPE,
  productionYear: vehicle?.productionYear ?? null,
  notes: vehicle?.notes ?? '',
});
