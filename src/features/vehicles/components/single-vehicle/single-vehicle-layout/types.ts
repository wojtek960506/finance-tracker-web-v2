import type { Vehicle } from '@vehicles/types';
import type { ReactNode } from 'react';

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
