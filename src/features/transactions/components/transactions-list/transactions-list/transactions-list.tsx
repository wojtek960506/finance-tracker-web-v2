import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { Transaction } from '@transactions/api';

import { TransactionPreview } from '../transaction-preview';
import { TransactionsPagination } from '../transactions-pagination';

type TransactionsListProps = {
  transactions: Transaction[];
  hasAnyTransactions: boolean;
  currentPage: number;
  totalPages: number;
  activeFiltersCount: number;
  onPageChange: (page: number) => void;
  emptyState?: ReactNode;
};

export const TransactionsList = ({
  transactions,
  hasAnyTransactions,
  currentPage,
  totalPages,
  activeFiltersCount,
  onPageChange,
  emptyState = null,
}: TransactionsListProps) => {
  const { t } = useTranslation('transactions');

  if (transactions.length === 0) {
    return hasAnyTransactions || activeFiltersCount > 0 ? (
      <p>{t('noTransactionsMatchingFilters')}</p>
    ) : (
      emptyState
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-2 sm:gap-3">
        {transactions.map((transaction) => (
          <TransactionPreview transaction={transaction} key={transaction.id} />
        ))}
      </ul>
      <TransactionsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};
