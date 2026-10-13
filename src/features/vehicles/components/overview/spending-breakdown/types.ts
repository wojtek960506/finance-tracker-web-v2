import type {
  VehicleEquipmentStats,
  VehicleFuelStats,
  VehicleMaintenanceStats,
} from '@vehicles/types';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type BreakdownCardProps = {
  title: string;
  entriesCount: number;
  totalSpentPln: number;
  Icon: LucideIcon;
  iconClassName: string;
  linkTo: string;
  children: ReactNode;
  'data-testid'?: string;
};

export type SpendingBreakdownProps = {
  vehicleSlug: string;
  totalSpentPln: number;
  fuel: VehicleFuelStats;
  maintenance: VehicleMaintenanceStats;
  equipment: VehicleEquipmentStats;
};

export type FuelBreakdownCardProps = {
  vehicleSlug: string;
  fuel: VehicleFuelStats;
};

export type MaintenanceBreakdownCardProps = {
  vehicleSlug: string;
  maintenance: VehicleMaintenanceStats;
};

export type EquipmentBreakdownCardProps = {
  vehicleSlug: string;
  equipment: VehicleEquipmentStats;
};
