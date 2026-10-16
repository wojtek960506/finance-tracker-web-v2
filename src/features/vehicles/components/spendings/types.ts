import type { SpendingType } from '@vehicles/api';

export type SpendingTarget = {
  id: string;
  type: SpendingType;
  costPln: number;
  date: string;
  title?: string;
  vehicleId?: string;
  vehicleName?: string;
};

export type DateFilterOption = 'exact' | 'window' | 'all';

export type CategoryFilterOption = 'transport' | 'all';

export type LinkSpendingModalProps = {
  isOpen: boolean;
  target: SpendingTarget | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export type UnlinkSpendingModalProps = {
  isOpen: boolean;
  target: SpendingTarget | null;
  onClose: () => void;
  onSuccess?: () => void;
};
