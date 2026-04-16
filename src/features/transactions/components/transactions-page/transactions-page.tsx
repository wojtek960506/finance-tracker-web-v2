import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IS_LG_MEDIA_QUERY, IS_XL_MEDIA_QUERY, MAIN_BUTTON_TEXT } from '@shared/consts';
import { useMediaQuery } from '@shared/hooks';
import { Button, Drawer } from '@shared/ui';
import { getTransactions, type TransactionFilters } from '@transactions/api';
import { TransactionsFiltersPanel } from '@transactions/components/transactions-filters';
import { TransactionsList } from '@transactions/components/transactions-list';
import { TransactionsTotalsPanel } from '@transactions/components/transactions-totals';
import {
  buildTransactionsRouteSearchParams,
  countActiveTransactionFilters,
  parseTransactionsRouteSearchParams,
} from '@transactions/utils/transactions-query';

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
export const TransactionsPage = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const totalsButtonRef = useRef<HTMLButtonElement | null>(null);
  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);
  const isLgScreen = useMediaQuery(IS_LG_MEDIA_QUERY);
  const isXlScreen = useMediaQuery(IS_XL_MEDIA_QUERY);
  const [openPanels, setOpenPanels] = useState({
    filters: false,
    totals: false,
  });

  const { page, filters } = parseTransactionsRouteSearchParams(searchParams);
  const activeFiltersCount = countActiveTransactionFilters(filters);
  const visibleCompactPanel = openPanels.filters
    ? 'filters'
    : openPanels.totals
      ? 'totals'
      : null;
  const isFiltersOpen = isXlScreen
    ? openPanels.filters
    : visibleCompactPanel === 'filters';
  const isTotalsOpen = isXlScreen ? openPanels.totals : visibleCompactPanel === 'totals';

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions', page, filters],
    queryFn: async () => await getTransactions({ page, filters }),
  });

  // when page is too big then we show the last available page
  useEffect(() => {
    if (data && data.totalPages < data.page && data.total > 0) {
      setSearchParams(
        buildTransactionsRouteSearchParams({ page: data.totalPages, filters }),
      );
    }
  }, [data, filters, setSearchParams]);

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  const isDrawerPanels = !isLgScreen;
  const isSharedSidebarVisible =
    isLgScreen && !isXlScreen && (isFiltersOpen || isTotalsOpen);
  const isLargeSidebarLayout = isXlScreen && (isFiltersOpen || isTotalsOpen);

  const handleToggleFilters = () => {
    if (isXlScreen) {
      setOpenPanels((prev) => ({ ...prev, filters: !prev.filters }));
      return;
    }

    setOpenPanels(
      visibleCompactPanel === 'filters'
        ? { filters: false, totals: false }
        : { filters: true, totals: false },
    );
  };

  const handleToggleTotals = () => {
    if (isXlScreen) {
      setOpenPanels((prev) => ({ ...prev, totals: !prev.totals }));
      return;
    }

    setOpenPanels(
      visibleCompactPanel === 'totals'
        ? { filters: false, totals: false }
        : { filters: false, totals: true },
    );
  };

  const handleApplyFilters = (nextFilters: TransactionFilters) => {
    setSearchParams(
      buildTransactionsRouteSearchParams({ page: 1, filters: nextFilters }),
    );

    if (isXlScreen) {
      setOpenPanels((prev) => ({ ...prev, filters: false }));
      return;
    }

    setOpenPanels({ filters: false, totals: false });
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams(buildTransactionsRouteSearchParams({ page: nextPage, filters }));
  };

  const filtersPanel = (
    <TransactionsFiltersPanel appliedFilters={filters} onApply={handleApplyFilters} />
  );
  const totalsPanel = <TransactionsTotalsPanel filters={filters} />;

  return (
    <>
      <div
        className={clsx(
          'h-full min-h-0 w-full overflow-hidden',
          isLargeSidebarLayout &&
            'xl:grid xl:grid-cols-[minmax(10rem,1fr)_35rem_minmax(10rem,1fr)] xl:justify-center xl:items-stretch xl:gap-6',
          isSharedSidebarVisible &&
            'lg:grid lg:grid-cols-[35rem_minmax(10rem,1fr)] lg:justify-center lg:items-stretch lg:gap-4',
        )}
      >
        {isLargeSidebarLayout ? (
          isTotalsOpen ? (
            <aside
              id="transactions-totals-panel"
              className="hidden min-h-0 min-w-0 xl:block xl:col-start-1 xl:w-full"
            >
              <div className="h-full">{totalsPanel}</div>
            </aside>
          ) : isFiltersOpen ? (
            <div className="hidden xl:block" aria-hidden="true" />
          ) : null
        ) : null}

        <div
          className={clsx(
            'transactions-page-main-column flex h-full min-h-0 min-w-0 flex-col gap-2 sm:gap-3',
            isSharedSidebarVisible
              ? 'w-full lg:mx-0 lg:max-w-[35rem]'
              : 'mx-auto w-full max-w-[35rem]',
            isLargeSidebarLayout &&
              'xl:col-start-2 xl:mx-auto xl:w-full xl:max-w-[35rem]',
          )}
        >
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button
              variant="primary"
              className={MAIN_BUTTON_TEXT}
              onClick={() => navigate('/transactions/new')}
            >
              {t('newTransaction')}
            </Button>

            <div className="transactions-page-panel-toggle-grid grid items-center gap-2 sm:gap-3">
              <Button
                ref={totalsButtonRef}
                type="button"
                variant={isTotalsOpen ? 'secondary' : 'outline'}
                className="gap-2"
                aria-expanded={isTotalsOpen}
                aria-controls="transactions-totals-panel"
                onClick={handleToggleTotals}
              >
                <span>{isTotalsOpen ? t('hideTotals') : t('showTotals')}</span>
                {isTotalsOpen ? (
                  <PanelLeftClose className="size-4 sm:size-5" aria-hidden="true" />
                ) : (
                  <PanelLeftOpen className="size-4 sm:size-5" aria-hidden="true" />
                )}
              </Button>

              <Button
                ref={filtersButtonRef}
                type="button"
                variant={isFiltersOpen ? 'secondary' : 'outline'}
                className="gap-2"
                aria-expanded={isFiltersOpen}
                aria-controls="transactions-filters-panel"
                onClick={handleToggleFilters}
              >
                {isFiltersOpen ? (
                  <PanelRightClose className="size-4 sm:size-5" aria-hidden="true" />
                ) : (
                  <PanelRightOpen className="size-4 sm:size-5" aria-hidden="true" />
                )}
                <span>{isFiltersOpen ? t('hideFilters') : t('showFilters')}</span>
                <span
                  className={clsx(
                    'inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold border border-1',
                    activeFiltersCount > 0
                      ? 'bg-bt-primary text-white'
                      : 'bg-bg text-text-muted',
                  )}
                >
                  {activeFiltersCount}
                </span>
              </Button>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto ">
            <TransactionsList
              transactions={data?.items ?? []}
              currentPage={data?.page ?? page}
              totalPages={data?.totalPages ?? 0}
              activeFiltersCount={activeFiltersCount}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {isLargeSidebarLayout ? (
          isFiltersOpen ? (
            <aside
              id="transactions-filters-panel"
              className="hidden min-h-0 min-w-0 xl:col-start-3 xl:block xl:w-full"
            >
              <div className="h-full overflow-y-auto pr-1">{filtersPanel}</div>
            </aside>
          ) : isTotalsOpen ? (
            <div className="hidden xl:block" aria-hidden="true" />
          ) : null
        ) : isSharedSidebarVisible ? (
          <aside
            className={clsx(
              'hidden min-h-0 min-w-0 lg:block lg:w-full',
              'lg:col-start-2',
            )}
          >
            <div
              id={
                isTotalsOpen ? 'transactions-totals-panel' : 'transactions-filters-panel'
              }
              className="h-full"
            >
              {isTotalsOpen ? totalsPanel : filtersPanel}
            </div>
          </aside>
        ) : null}
      </div>

      {isDrawerPanels && isTotalsOpen ? (
        <Drawer
          isOpen={isTotalsOpen}
          fromLeft={false}
          onClose={() => setOpenPanels({ filters: false, totals: false })}
          restoreFocusRef={totalsButtonRef}
          ariaLabel={t('totals')}
          panelClassName="w-full overflow-x-auto w-[min(340px,100vh)"
          contentClassName="min-w-[340px]"
        >
          <div id="transactions-totals-panel" className="pb-6">
            {totalsPanel}
          </div>
        </Drawer>
      ) : null}

      {isDrawerPanels && isFiltersOpen ? (
        <Drawer
          isOpen={isFiltersOpen}
          fromLeft={false}
          onClose={() => setOpenPanels({ filters: false, totals: false })}
          restoreFocusRef={filtersButtonRef}
          ariaLabel={t('filters')}
          panelClassName="w-full overflow-x-auto w-[min(340px,100vh)"
          contentClassName="min-w-[340px]"
        >
          <div id="transactions-filters-panel" className="pb-6">
            {filtersPanel}
          </div>
        </Drawer>
      ) : null}
    </>
  );
};
