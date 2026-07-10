import clsx from 'clsx';

import { TransactionsList } from '@transactions/components/transactions-list';
import { useTransactionsPageContext } from '@transactions/components/transactions-page/context';

import { TransactionsPageMainButtons } from './buttons';

export const TransactionsPageMainColumn = () => {
  const {
    isSharedSidebarVisible,
    isLargeSidebarLayout,
    activeFiltersCount,
    data,
    page,
    handlePageChange,
  } = useTransactionsPageContext();

  return (
    <div
      className={clsx(
        'transactions-page-main-column flex h-full min-h-0 min-w-0 flex-col gap-2 sm:gap-3',
        isSharedSidebarVisible
          ? 'w-full lg:mx-0 lg:max-w-[35rem]'
          : 'mx-auto w-full max-w-[35rem]',
        isLargeSidebarLayout && 'xl:col-start-2 xl:mx-auto xl:w-full xl:max-w-[35rem]',
      )}
    >
      <TransactionsPageMainButtons />
      <TransactionsList
        transactions={data?.items ?? []}
        hasAnyTransactions={(data?.total ?? 0) > 0}
        currentPage={data?.page ?? page}
        totalPages={data?.totalPages ?? 0}
        activeFiltersCount={activeFiltersCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
