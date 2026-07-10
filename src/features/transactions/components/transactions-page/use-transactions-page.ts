import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { getTransactionsRouteState } from '@transactions/utils/transactions-navigation';

import type { TransactionsPageContextValue } from './transactions-page-context.shared';
import { useTransactionsPageLayout } from './use-transactions-page-layout';
import { useTransactionsPageQuery } from './use-transactions-page-query';

export const useTransactionsPage = () => {
  const navigate = useNavigate();
  const totalsButtonRef = useRef<HTMLButtonElement | null>(null);
  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);
  const layoutState = useTransactionsPageLayout();
  const queryState = useTransactionsPageQuery({
    onFiltersApplied: layoutState.handleFiltersApplied,
  });
  const {
    data,
    page,
    filters,
    currentTransactionsRoute,
    activeFiltersCount,
    hasNoTransactions,
    handleApplyFilters,
    handlePageChange,
  } = queryState;

  const handleNavigateToNewTransaction = () => {
    navigate('/transactions/new', {
      state: getTransactionsRouteState(currentTransactionsRoute),
    });
  };

  const contextValue: TransactionsPageContextValue = {
    isFiltersOpen: layoutState.isFiltersOpen,
    isTotalsOpen: layoutState.isTotalsOpen,
    isDrawerPanels: layoutState.isDrawerPanels,
    isSharedSidebarVisible: layoutState.isSharedSidebarVisible,
    isLargeSidebarLayout: layoutState.isLargeSidebarLayout,
    hasNoTransactions,
    filters,
    data,
    page,
    activeFiltersCount,
    totalsButtonRef,
    filtersButtonRef,
    handleToggleTotals: layoutState.handleToggleTotals,
    handleToggleFilters: layoutState.handleToggleFilters,
    closePanels: layoutState.closePanels,
    handleNavigateToNewTransaction,
    handleApplyFilters,
    handlePageChange,
  };

  return {
    isLoading: queryState.isLoading,
    error: queryState.error,
    contextValue,
  };
};
