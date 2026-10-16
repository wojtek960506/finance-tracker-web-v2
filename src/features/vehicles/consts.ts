import {
  Banknote,
  ClipboardList,
  Fuel,
  Gauge,
  type LucideIcon,
  Milestone,
  Package,
  TrendingUp,
  Wrench,
} from 'lucide-react';

import type {
  GetEquipmentQuery,
  GetFuelEntriesQuery,
  GetMaintenanceQuery,
  GetVehicleOverviewQuery,
  MaintenanceSection,
} from './api/types';

export const VEHICLE_TYPES = ['motorcycle', 'car', 'public_transport'] as const;

export const DEFAULT_VEHICLE_TYPE = 'car' as const;

export const MAINTENANCE_SECTIONS = ['ownMaintenance', 'previousOwnerServices'] as const;

export const DEFAULT_MAINTENANCE_SECTION = 'ownMaintenance' as const;

export const SPENDING_TYPES = ['fuel', 'equipment', 'maintenance'] as const;

export type SpendingType = (typeof SPENDING_TYPES)[number];

export type SpendingTypeConfig = {
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  badgeClass: string;
};

export const TOTAL_SPENDING_CONFIG: SpendingTypeConfig = {
  icon: Banknote,
  colorClass: 'text-emerald-500',
  bgClass: 'bg-emerald-500/10',
  badgeClass: 'bg-emerald-500/10 text-emerald-500',
};

export const SPENDING_TYPE_CONFIG: Record<SpendingType, SpendingTypeConfig> = {
  fuel: {
    icon: Fuel,
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-500/10',
    badgeClass: 'bg-amber-500/10 text-amber-500',
  },
  maintenance: {
    icon: Wrench,
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    badgeClass: 'bg-blue-500/10 text-blue-500',
  },
  equipment: {
    icon: Package,
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-500/10',
    badgeClass: 'bg-purple-500/10 text-purple-500',
  },
};

export const MAINTENANCE_SECTION_CONFIG: Record<MaintenanceSection, SpendingTypeConfig> =
  {
    ownMaintenance: SPENDING_TYPE_CONFIG.maintenance,
    previousOwnerServices: {
      icon: ClipboardList,
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-500/10',
      badgeClass: 'bg-purple-500/10 text-purple-500',
    },
  };

export const FUEL_METRICS_CONFIG = {
  avgConsumption: {
    icon: Gauge,
    colorClass: 'text-orange-500',
  },
  avgUnitPrice: {
    icon: TrendingUp,
    colorClass: 'text-indigo-500',
  },
} as const;

export const VEHICLE_OVERVIEW_STATS_CONFIG = {
  odometer: {
    icon: Gauge,
    colorClass: 'text-orange-500',
  },
  distance: {
    icon: Milestone,
    colorClass: 'text-indigo-500',
  },
  fuel: SPENDING_TYPE_CONFIG.fuel,
  maintenance: SPENDING_TYPE_CONFIG.maintenance,
} as const;

export const vehiclesQueryKeys = {
  all: ['vehicles'] as const,
  list: () => ['vehicles', 'list'] as const,
  summary: () => ['vehicles', 'summary'] as const,
  details: (vehicleId: string) => ['vehicles', 'details', vehicleId] as const,
  overview: (vehicleId: string, query?: GetVehicleOverviewQuery) =>
    ['vehicles', vehicleId, 'overview', query] as const,
  fuel: (vehicleId: string, query?: GetFuelEntriesQuery) =>
    ['vehicles', vehicleId, 'fuel', query] as const,
  fuelEntry: (vehicleId: string, entryId: string) =>
    ['vehicles', vehicleId, 'fuel', entryId] as const,
  equipment: (vehicleId: string, query?: GetEquipmentQuery) =>
    ['vehicles', vehicleId, 'equipment', query] as const,
  equipmentItem: (vehicleId: string, equipmentId: string) =>
    ['vehicles', vehicleId, 'equipment', equipmentId] as const,
  maintenance: (vehicleId: string, query?: GetMaintenanceQuery) =>
    ['vehicles', vehicleId, 'maintenance', query] as const,
  maintenanceItem: (vehicleId: string, maintenanceId: string) =>
    ['vehicles', vehicleId, 'maintenance', maintenanceId] as const,
};
