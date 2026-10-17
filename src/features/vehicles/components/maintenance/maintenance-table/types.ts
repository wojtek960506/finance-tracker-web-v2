import type { MaintenanceSection, VehicleMaintenance } from '@vehicles/api';

export type MaintenanceTableProps = {
  activeSection?: MaintenanceSection;
  items: VehicleMaintenance[];
  hasFilters: boolean;
  onEditItem: (item: VehicleMaintenance) => void;
  onDeleteItem: (item: VehicleMaintenance) => void;
  onLinkItem?: (item: VehicleMaintenance) => void;
  onUnlinkItem?: (item: VehicleMaintenance) => void;
  onAddFirstItem: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void | Promise<unknown>;
  totalCount?: number;
  loadedCount?: number;
};

export type MaintenanceTableRowProps = {
  item: VehicleMaintenance;
  onEdit: () => void;
  onDelete: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
  showSectionBadge?: boolean;
};

export type MaintenanceMobileCardProps = {
  item: VehicleMaintenance;
  onEdit: () => void;
  onDelete: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
};

export type MaintenanceEmptyStateProps = {
  activeSection?: MaintenanceSection;
  hasFilters: boolean;
  onAddFirstItem: () => void;
};
