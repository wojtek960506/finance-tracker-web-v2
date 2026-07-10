import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button, Card, LoadingCard } from '@shared/ui';
import { getTransactions, type TransactionFilters } from '@transactions/api';
import { TransactionsFiltersPanel } from '@transactions/components/transactions-filters';
import { TransactionsTotalsPanel } from '@transactions/components/transactions-totals';
import { getTransactionsRouteState } from '@transactions/utils/transactions-navigation';
import {
  buildTransactionsRouteSearchParams,
  countActiveTransactionFilters,
  parseTransactionsRouteSearchParams,
} from '@transactions/utils/transactions-query';

import { TransactionsPageProvider } from './transactions-page-context';
import { TransactionsPageFiltersDrawer } from './transactions-page-filters-drawer';
import { TransactionsPageFiltersSidebar } from './transactions-page-filters-sidebar';
import { TransactionsPageMainColumn } from './transactions-page-main-column';
import { TransactionsPageTotalsDrawer } from './transactions-page-totals-drawer';
import { TransactionsPageWideTotalsSidebar } from './transactions-page-wide-totals-sidebar';
import { useTransactionsPageLayout } from './use-transactions-page-layout';

// TODO:
// 1. refactor this file
// 2. in forms also do some refactor for single fields
// 3. useEffect for too high page number might be somehow enhanced
// 4. there is some strange behavior for date picker in filter as clicking anywhere is moving to
//    the previous month and also sometimes is mark all of the days
// 5. next click on selectors is swallowed
// 6. when placeholder of selector is too long then it just make it wider and it can exceed the
//    size of parent component
// 7. when selector is open at the beginning scrolling of the whole page works but then it is not
//    possible without focusing on something outside selector
// 8. selector sometimes exceeds size of the parent component when it is open and then
//    scrolling is also strange (maybe can be open above when there is enough space and then
//    can be moved under when there is enough space)
// 9. replace full transactions/totals refetch after create/delete with optimistic query updates
// 10. consider replacing generic loading states with screen-specific skeleton UIs
// 11. revisit bundle size warnings and introduce route-level code splitting where it helps PR #13
export const TransactionsPage = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const totalsButtonRef = useRef<HTMLButtonElement | null>(null);
  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);
  const {
    isFiltersOpen,
    isTotalsOpen,
    isDrawerPanels,
    isSharedSidebarVisible,
    isLargeSidebarLayout,
    handleToggleFilters,
    handleToggleTotals,
    handleFiltersApplied,
    closePanels,
  } = useTransactionsPageLayout();

  const { page, filters } = parseTransactionsRouteSearchParams(searchParams);
  const currentTransactionsRoute = `/transactions${
    searchParams.size > 0 ? `?${searchParams.toString()}` : ''
  }`;
  const activeFiltersCount = countActiveTransactionFilters(filters);

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', page, filters],
    queryFn: async () => await getTransactions({ page, filters }),
  });
  const hasNoTransactions = (data?.total ?? 0) === 0 && activeFiltersCount === 0;

  // when page is too big then we show the last available page
  useEffect(() => {
    if (data && data.totalPages < data.page && data.total > 0) {
      setSearchParams(
        buildTransactionsRouteSearchParams({ page: data.totalPages, filters }),
      );
    }
  }, [data, filters, setSearchParams]);

  if (isLoading) {
    return (
      <LoadingCard
        title={t('loadingTransactions')}
        description={t('loadingTransactionsDescription')}
        widthClassName="max-w-[35rem]"
      />
    );
  }
  if (error) return <p>{error.message}</p>;

  const handleApplyFilters = (nextFilters: TransactionFilters) => {
    setSearchParams(
      buildTransactionsRouteSearchParams({ page: 1, filters: nextFilters }),
    );
    handleFiltersApplied();
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
  const emptyTransactionsState = (
    <Card
      className={clsx(
        'mx-auto mt-2 w-full max-w-[35rem] items-center gap-4 rounded-3xl border-fg/20',
        'bg-modal-bg/95 p-6 text-center sm:mt-3 sm:p-8',
      )}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold sm:text-2xl">
          {t('emptyTransactionsTitle')}
        </h2>
        <p className="text-sm text-text-muted sm:text-base">
          {t('emptyTransactionsDescription')}
        </p>
      </div>

      <Button
        variant="primary"
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'mt-2 sm:mt-3 w-full')}
        onClick={() =>
          navigate('/transactions/new', {
            state: getTransactionsRouteState(currentTransactionsRoute),
          })
        }
      >
        {t('createFirstTransaction')}
      </Button>
    </Card>
  );

  return (
    <TransactionsPageProvider
      value={{
        isFiltersOpen,
        isTotalsOpen,
        isDrawerPanels,
        isSharedSidebarVisible,
        isLargeSidebarLayout,
        hasNoTransactions,
        filters,
        data,
        page,
        activeFiltersCount,
        totalsButtonRef,
        filtersButtonRef,
        handleToggleTotals,
        handleToggleFilters,
        closePanels,
        handleNavigateToNewTransaction,
        handlePageChange,
        totalsPanel,
        filtersPanel,
        emptyTransactionsState,
      }}
    >
      <>
        <div
          className={clsx(
            'h-full min-h-0 w-full overflow-hidden',
            isLargeSidebarLayout &&
              clsx(
                'xl:grid xl:grid-cols-[minmax(10rem,1fr)_35rem_minmax(10rem,1fr)]',
                'xl:justify-center xl:items-stretch xl:gap-6',
              ),
            isSharedSidebarVisible &&
              clsx(
                'lg:grid lg:grid-cols-[35rem_minmax(10rem,1fr)]',
                'lg:justify-center lg:items-stretch lg:gap-4',
              ),
          )}
        >
          <TransactionsPageWideTotalsSidebar />
          <TransactionsPageMainColumn />
          <TransactionsPageFiltersSidebar />
        </div>
        <TransactionsPageTotalsDrawer />
        <TransactionsPageFiltersDrawer />
      </>
    </TransactionsPageProvider>
  );
};
