import { useTransactionsPageContext } from './transactions-page-context';

export const TransactionsPageWideTotalsSidebar = () => {
  const {
    hasNoTransactions,
    isLargeSidebarLayout,
    isTotalsOpen,
    isFiltersOpen,
    totalsPanel,
  } = useTransactionsPageContext();

  if (hasNoTransactions || !isLargeSidebarLayout) return null;

  if (isTotalsOpen) {
    return (
      <aside
        id="transactions-totals-panel"
        className="hidden min-h-0 min-w-0 xl:block xl:col-start-1 xl:w-full"
      >
        <div className="h-full">{totalsPanel}</div>
      </aside>
    );
  }

  if (isFiltersOpen) {
    return <div className="hidden xl:block" aria-hidden="true" />;
  }

  return null;
};
