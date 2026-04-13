import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { IS_LG_MEDIA_QUERY, IS_XL_MEDIA_QUERY, MAIN_BUTTON_TEXT } from '@shared/consts';
import { useMediaQuery } from '@shared/hooks';
import { Button, Drawer } from '@shared/ui';
import { getTransactions, type TransactionFilters } from '@transactions/api';
import {
  buildTransactionsRouteSearchParams,
  countActiveTransactionFilters,
  parseTransactionsRouteSearchParams,
} from '@transactions/utils/transactions-query';

import { TransactionPreview } from './transaction-preview';
import { TransactionsFiltersPanel } from './transactions-filters-panel';
import { TransactionsPagination } from './transactions-pagination';

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
export const TransactionsList = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);
  const isLgScreen = useMediaQuery(IS_LG_MEDIA_QUERY);
  const isXlScreen = useMediaQuery(IS_XL_MEDIA_QUERY);
  const [isFiltersOpenOverride, setIsFiltersOpenOverride] = useState(false);

  const { page, filters } = parseTransactionsRouteSearchParams(searchParams);
  const activeFiltersCount = countActiveTransactionFilters(filters);
  const isFiltersOpen = isFiltersOpenOverride;

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

  const isDrawerFilters = !isLgScreen;
  const isSidebarVisible = isLgScreen && isFiltersOpen;
  const isLargeSidebarLayout = isXlScreen && isSidebarVisible;

  const handleToggleFilters = () => {
    setIsFiltersOpenOverride((prev) => !prev);
  };

  const handleApplyFilters = (nextFilters: TransactionFilters) => {
    setSearchParams(
      buildTransactionsRouteSearchParams({ page: 1, filters: nextFilters }),
    );
    setIsFiltersOpenOverride(false);
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams(buildTransactionsRouteSearchParams({ page: nextPage, filters }));
  };

  const filtersPanel = (
    <TransactionsFiltersPanel appliedFilters={filters} onApply={handleApplyFilters} />
  );

  const listContent =
    !data || data.items.length === 0 ? (
      <p>
        {activeFiltersCount > 0
          ? t('noTransactionsMatchingFilters')
          : 'There are no transactions - TODO add button to create one'}
      </p>
    ) : (
      <>
        <ul className="flex flex-col gap-2 sm:gap-3">
          {data.items.map((transaction) => (
            <TransactionPreview transaction={transaction} key={transaction.id} />
          ))}
        </ul>
        <TransactionsPagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );

  return (
    <>
      <div
        className={clsx(
          'w-full',
          isLargeSidebarLayout &&
            'xl:grid xl:grid-cols-[minmax(0,1fr)_37.5rem_minmax(0,1fr)] xl:justify-center xl:items-start xl:gap-6',
          isSidebarVisible &&
            !isXlScreen &&
            'lg:grid lg:grid-cols-[37.5rem_minmax(20rem,1fr)] lg:justify-center lg:items-start lg:gap-4',
        )}
      >
        {isLargeSidebarLayout ? (
          <div className="hidden xl:block" aria-hidden="true" />
        ) : null}

        <div
          className={clsx(
            'flex min-w-0 flex-col gap-2 sm:gap-3',
            isSidebarVisible && !isXlScreen
              ? 'w-full lg:mx-0 lg:max-w-150'
              : 'mx-auto w-full max-w-150',
            isLargeSidebarLayout && 'xl:col-start-2 xl:mx-auto xl:w-full xl:max-w-150',
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <Button
              variant="primary"
              className={MAIN_BUTTON_TEXT}
              onClick={() => navigate('/transactions/new')}
            >
              {t('newTransaction')}
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
                  'inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                  activeFiltersCount > 0
                    ? 'bg-bt-primary text-white'
                    : 'bg-bg text-text-muted',
                )}
              >
                {activeFiltersCount}
              </span>
            </Button>
          </div>

          {listContent}
        </div>

        {isSidebarVisible ? (
          <aside
            id="transactions-filters-panel"
            className={clsx(
              'hidden min-w-0 lg:block lg:w-full',
              isLargeSidebarLayout ? 'xl:col-start-3' : 'lg:col-start-2',
            )}
          >
            {filtersPanel}
          </aside>
        ) : null}
      </div>

      {isDrawerFilters && isFiltersOpen ? (
        <Drawer
          isOpen={isFiltersOpen}
          fromLeft={false}
          onClose={() => setIsFiltersOpenOverride(false)}
          restoreFocusRef={filtersButtonRef}
          ariaLabel={t('filters')}
          panelClassName="w-full"
        >
          <div id="transactions-filters-panel" className="pb-6">
            {filtersPanel}
          </div>
        </Drawer>
      ) : null}
    </>
  );
};
