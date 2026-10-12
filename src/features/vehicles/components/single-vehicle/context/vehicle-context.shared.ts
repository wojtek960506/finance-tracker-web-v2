import type { Vehicle } from '@vehicles/types';
import { createContext } from 'react';

export type VehicleContextValue = {
  vehicle: Vehicle;
  refetchVehicle?: () => Promise<unknown>;
};

export const VehicleContext = createContext<VehicleContextValue | null>(null);
