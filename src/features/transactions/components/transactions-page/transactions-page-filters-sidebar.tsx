import clsx from 'clsx';

import { useTransactionsPageContext } from './transactions-page-context';

export const TransactionsPageFiltersSidebar = () => {
  const {
    hasNoTransactions,
    isLargeSidebarLayout,
    isSharedSidebarVisible,
    isFiltersOpen,
    isTotalsOpen,
    filtersPanel,
    totalsPanel,
  } = useTransactionsPageContext();

  if (hasNoTransactions) return null;

  if (isLargeSidebarLayout) {
    if (isFiltersOpen) {
      return (
        <aside
          id="transactions-filters-panel"
          className="hidden min-h-0 min-w-0 xl:col-start-3 xl:block xl:w-full"
        >
          <div className="h-full overflow-y-auto pr-1">{filtersPanel}</div>
        </aside>
      );
    }

    if (isTotalsOpen) {
      return <div className="hidden xl:block" aria-hidden="true" />;
    }

    return null;
  }

  if (isSharedSidebarVisible) {
    return (
      <aside
        className={clsx('hidden min-h-0 min-w-0 lg:block lg:w-full', 'lg:col-start-2')}
      >
        <div
          id={isTotalsOpen ? 'transactions-totals-panel' : 'transactions-filters-panel'}
          className="h-full"
        >
          {isTotalsOpen ? totalsPanel : filtersPanel}
        </div>
      </aside>
    );
  }

  return null;
};
