import { useTranslation } from 'react-i18next';

import type { Transaction } from '@transactions/api';

import { TransactionPreview } from './transaction-preview';
import { TransactionsListEmptyState } from './transactions-list-empty-state';
import { TransactionsPagination } from './transactions-pagination';

type TransactionsListProps = {
  transactions: Transaction[];
  hasAnyTransactions: boolean;
  currentPage: number;
  totalPages: number;
  activeFiltersCount: number;
  onPageChange: (page: number) => void;
};

export const TransactionsList = ({
  transactions,
  hasAnyTransactions,
  currentPage,
  totalPages,
  activeFiltersCount,
  onPageChange,
}: TransactionsListProps) => {
  const { t } = useTranslation('transactions');

  if (transactions.length === 0) {
    return hasAnyTransactions || activeFiltersCount > 0 ? (
      <p>{t('noTransactionsMatchingFilters')}</p>
    ) : (<TransactionsListEmptyState />);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-2 sm:gap-3">
          {transactions.map((transaction) => (
            <TransactionPreview transaction={transaction} key={transaction.id} />
          ))}
        </ul>
      </div>
      <TransactionsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
