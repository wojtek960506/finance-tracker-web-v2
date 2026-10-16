import type { VehicleFuelEntryEnriched } from '@vehicles/api';

export type FuelTableProps = {
  entries: VehicleFuelEntryEnriched[];
  hasFilters: boolean;
  onEditEntry: (entry: VehicleFuelEntryEnriched) => void;
  onDeleteEntry: (entry: VehicleFuelEntryEnriched) => void;
  onLinkEntry?: (entry: VehicleFuelEntryEnriched) => void;
  onUnlinkEntry?: (entry: VehicleFuelEntryEnriched) => void;
  onAddFirstEntry: () => void;
};

export type FuelTableRowProps = {
  entry: VehicleFuelEntryEnriched;
  onEdit: () => void;
  onDelete: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
};

export type FuelMobileCardProps = {
  entry: VehicleFuelEntryEnriched;
  onEdit: () => void;
  onDelete: () => void;
  onLink?: () => void;
  onUnlink?: () => void;
};
