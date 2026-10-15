import type { MaintenanceSection, VehicleMaintenance } from '@vehicles/api';

export type MaintenanceTableProps = {
  activeSection?: MaintenanceSection;
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
  activeSection?: MaintenanceSection;
  hasFilters: boolean;
  onAddFirstItem: () => void;
};
