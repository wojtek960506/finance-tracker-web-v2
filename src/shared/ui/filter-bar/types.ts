import type { ReactNode } from 'react';

export type FilterBarProps = {
  testId?: string;
  toggleTestId?: string;
  resetTestId?: string;
  containerTestId?: string;
  filterLabel?: string;
  resetLabel?: string;
  hasActiveFilters: boolean;
  onResetFilters?: () => void;
  actionButton?: ReactNode;
  children: ReactNode;
  className?: string;
};
