export type EquipmentFilters = {
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type EquipmentFilterBarProps = {
  filters: EquipmentFilters;
  onFiltersChange: (filters: EquipmentFilters) => void;
  onAddEquipment: () => void;
};
