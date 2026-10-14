import type { VehicleMaintenance } from '@vehicles/types';

export type MaintenanceTableProps = {
  items: VehicleMaintenance[];
  hasFilters: boolean;
  onEditItem: (item: VehicleMaintenance) => void;
  onDeleteItem: (item: VehicleMaintenance) => void;
  onAddFirstItem: () => void;
};

export type MaintenanceTableRowProps = {
  item: VehicleMaintenance;
  onEdit: () => void;
  onDelete: () => void;
};

export type MaintenanceMobileCardProps = {
  item: VehicleMaintenance;
  onEdit: () => void;
  onDelete: () => void;
};

export type MaintenanceEmptyStateProps = {
  hasFilters: boolean;
  onAddFirstItem: () => void;
};
