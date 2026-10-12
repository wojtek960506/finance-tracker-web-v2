import { createContext } from 'react';

import type { Vehicle } from '../../../types';

export type VehicleContextValue = {
  vehicle: Vehicle;
  refetchVehicle?: () => Promise<unknown>;
};

export const VehicleContext = createContext<VehicleContextValue | null>(null);
