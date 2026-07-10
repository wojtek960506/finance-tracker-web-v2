import clsx from 'clsx';

import { useTransactionsPageContext } from '../context';

import { TransactionsPageFiltersDrawer } from './transactions-page-filters-drawer';
import { TransactionsPageFiltersSidebar } from './transactions-page-filters-sidebar';
import { TransactionsPageMainColumn } from './transactions-page-main-column';
import { TransactionsPageTotalsDrawer } from './transactions-page-totals-drawer';
import { TransactionsPageWideTotalsSidebar } from './transactions-page-wide-totals-sidebar';

export const TransactionsPageContent = () => {
  const { isSharedSidebarVisible, isLargeSidebarLayout } = useTransactionsPageContext();

  return (
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
  );
};
