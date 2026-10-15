import type { VehicleMaintenance } from '@vehicles/api';

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
  showSectionBadge?: boolean;
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
