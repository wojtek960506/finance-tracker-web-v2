import type { ReactNode } from 'react';

import { VehicleContext, type VehicleContextValue } from './vehicle-context.shared';

export type VehicleProviderProps = {
  value: VehicleContextValue;
  children: ReactNode;
};

export const VehicleProvider = ({ value, children }: VehicleProviderProps) => {
  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
};
