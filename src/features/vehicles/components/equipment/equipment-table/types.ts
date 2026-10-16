import type { VehicleEquipment } from '@vehicles/api';

export type EquipmentTableProps = {
  items: VehicleEquipment[];
  hasFilters: boolean;
  onEditItem: (item: VehicleEquipment) => void;
  onDeleteItem: (item: VehicleEquipment) => void;
  onLinkItem?: (item: VehicleEquipment) => void;
  onUnlinkItem?: (item: VehicleEquipment) => void;
  onAddFirstItem: () => void;
};

export type EquipmentTableRowProps = {
  item: VehicleEquipment;
  onEdit: () => void;
  onDelete: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
};

export type EquipmentMobileCardProps = {
  item: VehicleEquipment;
  onEdit: () => void;
  onDelete: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
};

export type EquipmentEmptyStateProps = {
  hasFilters: boolean;
  onAddFirstItem: () => void;
};
