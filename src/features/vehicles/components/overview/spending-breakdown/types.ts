import type {
  VehicleOverviewEquipmentStats,
  VehicleOverviewFuelStats,
} from '@vehicles/api';
import type { VehicleOverviewMaintenanceStatsWithSection } from '@vehicles/types';
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
  fuel: VehicleOverviewFuelStats;
  maintenance: VehicleOverviewMaintenanceStatsWithSection;
  equipment: VehicleOverviewEquipmentStats;
};

export type FuelBreakdownCardProps = {
  vehicleSlug: string;
  fuel: VehicleOverviewFuelStats;
};

export type MaintenanceBreakdownCardProps = {
  vehicleSlug: string;
  maintenance: VehicleOverviewMaintenanceStatsWithSection;
};

export type EquipmentBreakdownCardProps = {
  vehicleSlug: string;
  equipment: VehicleOverviewEquipmentStats;
};
