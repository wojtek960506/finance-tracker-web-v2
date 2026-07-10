import type { ReactNode, RefObject } from 'react';
import { createContext } from 'react';

import type { TransactionFilters, TransactionsResponse } from '@transactions/api';

export type TransactionsPageContextValue = {
  isFiltersOpen: boolean;
  isTotalsOpen: boolean;
  isDrawerPanels: boolean;
  isSharedSidebarVisible: boolean;
  isLargeSidebarLayout: boolean;
  hasNoTransactions: boolean;
  filters: TransactionFilters;
  data: TransactionsResponse | undefined;
  page: number;
  activeFiltersCount: number;
  totalsButtonRef: RefObject<HTMLButtonElement | null>;
  filtersButtonRef: RefObject<HTMLButtonElement | null>;
  handleToggleTotals: () => void;
  handleToggleFilters: () => void;
  closePanels: () => void;
  handleNavigateToNewTransaction: () => void;
  handlePageChange: (page: number) => void;
  totalsPanel: ReactNode;
  filtersPanel: ReactNode;
};

export const TransactionsPageContext = createContext<TransactionsPageContextValue | null>(
  null,
);
