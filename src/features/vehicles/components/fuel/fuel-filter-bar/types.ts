export type FuelFilters = {
  startDate?: string;
  endDate?: string;
  isFullTank?: boolean;
};

export type FuelFilterBarProps = {
  filters: FuelFilters;
  onFiltersChange: (filters: FuelFilters) => void;
  onAddEntry: () => void;
};
