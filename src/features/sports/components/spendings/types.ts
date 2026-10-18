import type { SportSpendingTarget } from '../../api/types';

export type DateFilterOption = 'exact' | 'window' | 'all';
export type CategoryFilterOption = 'sport' | 'all';

export interface LinkSportSpendingModalProps {
  isOpen: boolean;
  targets: SportSpendingTarget[];
  onClose: () => void;
  onSuccess?: () => void;
}

export interface UnlinkSportSpendingModalProps {
  isOpen: boolean;
  target: SportSpendingTarget | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface SportSpendingModalsProps {
  linkingTargets: SportSpendingTarget[];
  unlinkingTarget: SportSpendingTarget | null;
  onCloseLink: () => void;
  onCloseUnlink: () => void;
  onSuccessLink?: () => void;
  onSuccessUnlink?: () => void;
}
