import type { RefObject } from 'react';
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
  handleApplyFilters: (nextFilters: TransactionFilters) => void;
  handlePageChange: (page: number) => void;
};

export const TransactionsPageContext = createContext<TransactionsPageContextValue | null>(
  null,
);
