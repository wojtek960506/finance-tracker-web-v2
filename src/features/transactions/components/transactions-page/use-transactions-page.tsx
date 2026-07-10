import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getTransactions, type TransactionFilters } from '@transactions/api';
import { TransactionsFiltersPanel } from '@transactions/components/transactions-filters';
import { TransactionsTotalsPanel } from '@transactions/components/transactions-totals';
import { getTransactionsRouteState } from '@transactions/utils/transactions-navigation';
import {
  buildTransactionsRouteSearchParams,
  countActiveTransactionFilters,
  parseTransactionsRouteSearchParams,
} from '@transactions/utils/transactions-query';

import type { TransactionsPageContextValue } from './transactions-page-context.shared';
import { useTransactionsPageLayout } from './use-transactions-page-layout';

export const useTransactionsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const totalsButtonRef = useRef<HTMLButtonElement | null>(null);
  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);
  const layoutState = useTransactionsPageLayout();
  const { page, filters } = parseTransactionsRouteSearchParams(searchParams);
  const currentTransactionsRoute = `/transactions${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ''
  }`;
  const activeFiltersCount = countActiveTransactionFilters(filters);

  const queryState = useQuery({
    queryKey: ['transactions', page, filters],
    queryFn: async () => await getTransactions({ page, filters }),
  });
  const { data } = queryState;
  const hasNoTransactions = (data?.total ?? 0) === 0 && activeFiltersCount === 0;

  // when page is too big then we show the last available page
  useEffect(() => {
    if (data && data.totalPages < data.page && data.total > 0) {
      setSearchParams(
        buildTransactionsRouteSearchParams({ page: data.totalPages, filters }),
      );
    }
  }, [data, filters, setSearchParams]);

  const handleApplyFilters = (nextFilters: TransactionFilters) => {
    setSearchParams(
      buildTransactionsRouteSearchParams({ page: 1, filters: nextFilters }),
    );
    layoutState.handleFiltersApplied();
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams(buildTransactionsRouteSearchParams({ page: nextPage, filters }));
  };

  const handleNavigateToNewTransaction = () => {
    navigate('/transactions/new', {
      state: getTransactionsRouteState(currentTransactionsRoute),
    });
  };

  const filtersPanel = (
    <TransactionsFiltersPanel appliedFilters={filters} onApply={handleApplyFilters} />
  );
  const totalsPanel = <TransactionsTotalsPanel filters={filters} />;

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
    handlePageChange,
    totalsPanel,
    filtersPanel,
  };

  return {
    isLoading: queryState.isLoading,
    error: queryState.error,
    contextValue,
  };
};
