import type { MaintenanceSection, Vehicle } from './api/types';

export * from './api/types';

export type VehicleSpendingSummary = {
  fuelTotalPln: number;
  maintenanceTotalPln: number;
  equipmentTotalPln: number;
  totalSpentPln: number;
  lastOdometerKm: number | null;
  fuelEntriesCount: number;
  maintenanceCount: number;
  equipmentCount: number;
};

export type VehicleWithSpending = Vehicle & {
  spending: VehicleSpendingSummary;
};

export type GlobalVehiclesSummary = {
  totalVehicles: number;
  totalSpentPln: number;
  totalFuelSpentPln: number;
  totalMaintenanceSpentPln: number;
  totalEquipmentSpentPln: number;
};

export type VehicleFuelStats = {
  totalSpentPln: number;
  totalLiters: number;
  avgConsumptionLPer100Km: number | null;
  costPerKmPln: number | null;
  entriesCount: number;
};

export type VehicleMaintenanceStats = {
  totalSpentPln: number;
  entriesCount: number;
  bySection: Record<MaintenanceSection, { costPln: number; count: number }>;
};

export type VehicleEquipmentStats = {
  totalSpentPln: number;
  entriesCount: number;
};

export type VehicleStats = {
  currentOdometerKm: number | null;
  minOdometerKm: number | null;
  totalDistanceKm: number | null;
  refuelingCount: number;
  maintenanceCount: number;
  equipmentCount: number;
};

export type VehicleActivityType = 'fuel' | 'maintenance' | 'equipment';

export type VehicleActivityItem = {
  id: string;
  type: VehicleActivityType;
  date: string;
  costPln: number;
  title: string;
  description?: string;
  odometerKm?: number | null;
  transactionId?: string | null;
  fuelLiters?: number;
  isFullTank?: boolean;
  consumptionLPer100Km?: number | null;
  maintenanceSection?: MaintenanceSection;
  serviceProvider?: string;
};

export type VehicleOverviewData = {
  totalSpentPln: number;
  fuel: VehicleFuelStats;
  maintenance: VehicleMaintenanceStats;
  equipment: VehicleEquipmentStats;
  stats: VehicleStats;
  recentActivity: VehicleActivityItem[];
};
