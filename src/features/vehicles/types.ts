import type {
  MaintenanceSection,
  VehicleOverviewActivityItem,
  VehicleOverviewEquipmentStats,
  VehicleOverviewFuelStats,
  VehicleOverviewMaintenanceStats,
  VehicleOverviewStats,
} from './api/types';

export * from './api/types';

export type VehicleOverviewMaintenanceStatsWithSection =
  VehicleOverviewMaintenanceStats & {
    bySection: Record<MaintenanceSection, { costPln: number; count: number }>;
  };

export type VehicleOverviewData = {
  totalSpentPln: number;
  fuel: VehicleOverviewFuelStats;
  maintenance: VehicleOverviewMaintenanceStatsWithSection;
  equipment: VehicleOverviewEquipmentStats;
  stats: VehicleOverviewStats;
  recentActivity: VehicleOverviewActivityItem[];
};
