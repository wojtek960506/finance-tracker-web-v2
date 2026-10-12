import { useContext } from 'react';

import { VehicleContext, type VehicleContextValue } from './vehicle-context.shared';

export const useVehicleContext = (): VehicleContextValue => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicleContext must be used within a VehicleProvider');
  }
  return context;
};
