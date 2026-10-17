import type { Vehicle } from '@vehicles/api';
import type { ReactNode } from 'react';

export type SingleVehicleLayoutProps = {
  vehicleSlug?: string;
  children?: ReactNode;
};

export type SingleVehicleHeaderProps = {
  vehicle: Vehicle;
  isMobileNavOpen: boolean;
  onToggleMobileNav: () => void;
};

export type SingleVehicleTabsProps = {
  vehicleSlug: string;
  isMobileNavOpen: boolean;
  onCloseMobileNav: () => void;
};
