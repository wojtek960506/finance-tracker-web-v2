import type { ReactNode } from 'react';

import type { Vehicle } from '../../../types';

export type SingleVehicleLayoutProps = {
  vehicleSlug?: string;
  children?: ReactNode;
};

export type SingleVehicleHeaderProps = {
  vehicle: Vehicle;
  onVehicleUpdated?: (updated: Vehicle) => void;
};

export type SingleVehicleTabsProps = {
  vehicleSlug: string;
};
