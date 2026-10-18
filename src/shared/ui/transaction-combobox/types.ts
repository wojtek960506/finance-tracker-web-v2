import type { Transaction } from '@transactions/api';

export type DateFilterOption = 'exact' | 'window' | 'all';

export interface TransactionComboboxProps {
  value: Transaction | null;
  onChange: (tx: Transaction | null) => void;
  targetDate?: string;
  targetAmount?: number;
  dateFilter?: DateFilterOption;
  categoryPredicate?: (categoryName?: string) => boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  loadingPlaceholder?: string;
  emptyMessage?: string;
  exactMatchBadgeText?: string;
}
