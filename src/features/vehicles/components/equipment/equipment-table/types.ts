import type { VehicleEquipment } from '@vehicles/types';

export type EquipmentTableProps = {
  items: VehicleEquipment[];
  hasFilters: boolean;
  onEditItem: (item: VehicleEquipment) => void;
  onDeleteItem: (item: VehicleEquipment) => void;
  onAddFirstItem: () => void;
};

export type EquipmentTableRowProps = {
  item: VehicleEquipment;
  onEdit: () => void;
  onDelete: () => void;
};

export type EquipmentMobileCardProps = {
  item: VehicleEquipment;
  onEdit: () => void;
  onDelete: () => void;
};

export type EquipmentEmptyStateProps = {
  hasFilters: boolean;
  onAddFirstItem: () => void;
};
