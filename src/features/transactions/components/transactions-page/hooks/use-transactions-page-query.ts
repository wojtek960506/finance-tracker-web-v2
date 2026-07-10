import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getTransactions, type TransactionFilters } from '@transactions/api';
import {
  buildTransactionsRouteSearchParams,
  countActiveTransactionFilters,
  parseTransactionsRouteSearchParams,
} from '@transactions/utils/transactions-query';

export const useTransactionsPageQuery = ({
  onFiltersApplied,
}: {
  onFiltersApplied: () => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    onFiltersApplied();
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams(buildTransactionsRouteSearchParams({ page: nextPage, filters }));
  };

  return {
    ...queryState,
    data,
    page,
    filters,
    currentTransactionsRoute,
    activeFiltersCount,
    hasNoTransactions,
    handleApplyFilters,
    handlePageChange,
  };
};
