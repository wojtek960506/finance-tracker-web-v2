import type { Vehicle } from './api/types';

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
