import type { ReactNode, RefObject } from 'react';
import { createContext, useContext } from 'react';

import type { TransactionFilters, TransactionsResponse } from '@transactions/api';

type TransactionsPageContextValue = {
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
  emptyTransactionsState: ReactNode;
};

const TransactionsPageContext = createContext<TransactionsPageContextValue | null>(null);

export const TransactionsPageProvider = ({
  value,
  children,
}: {
  value: TransactionsPageContextValue;
  children: ReactNode;
}) => (
  <TransactionsPageContext.Provider value={value}>
    {children}
  </TransactionsPageContext.Provider>
);

export const useTransactionsPageContext = () => {
  const context = useContext(TransactionsPageContext);

  if (!context) {
    throw new Error(
      'useTransactionsPageContext must be used within a TransactionsPageProvider',
    );
  }

  return context;
};
