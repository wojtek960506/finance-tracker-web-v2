import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { getTransactionsRouteState } from '@transactions/utils/transactions-navigation';

import type { TransactionsPageContextValue } from '../context';

import { useTransactionsPageLayout } from './use-transactions-page-layout';
import { useTransactionsPageQuery } from './use-transactions-page-query';

export const useTransactionsPage = () => {
  const navigate = useNavigate();
  const totalsButtonRef = useRef<HTMLButtonElement | null>(null);
  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);
  const layoutState = useTransactionsPageLayout();
  const queryState = useTransactionsPageQuery({
    onFiltersApplied: layoutState.actions.handleFiltersApplied,
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
    isFiltersOpen: layoutState.panels.isFiltersOpen,
    isTotalsOpen: layoutState.panels.isTotalsOpen,
    isDrawerPanels: layoutState.layout.isDrawerPanels,
    isSharedSidebarVisible: layoutState.layout.isSharedSidebarVisible,
    isLargeSidebarLayout: layoutState.layout.isLargeSidebarLayout,
    hasNoTransactions,
    filters,
    data,
    page,
    activeFiltersCount,
    totalsButtonRef,
    filtersButtonRef,
    handleToggleTotals: layoutState.actions.handleToggleTotals,
    handleToggleFilters: layoutState.actions.handleToggleFilters,
    closePanels: layoutState.actions.closePanels,
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
