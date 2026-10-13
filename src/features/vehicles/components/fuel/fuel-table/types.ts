import type { VehicleFuelEntryEnriched } from '@vehicles/types';

export type FuelTableProps = {
  entries: VehicleFuelEntryEnriched[];
  hasFilters: boolean;
  onEditEntry: (entry: VehicleFuelEntryEnriched) => void;
  onDeleteEntry: (entry: VehicleFuelEntryEnriched) => void;
  onAddFirstEntry: () => void;
};

export type FuelTableRowProps = {
  entry: VehicleFuelEntryEnriched;
  onEdit: () => void;
  onDelete: () => void;
};

export type FuelMobileCardProps = {
  entry: VehicleFuelEntryEnriched;
  onEdit: () => void;
  onDelete: () => void;
};
