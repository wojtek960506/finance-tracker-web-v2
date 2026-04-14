import { useTranslation } from 'react-i18next';

import type { Transaction } from '@transactions/api';

import { TransactionPreview } from './transaction-preview';
import { TransactionsPagination } from './transactions-pagination';

type TransactionsListProps = {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  activeFiltersCount: number;
  onPageChange: (page: number) => void;
};

export const TransactionsList = ({
  transactions,
  currentPage,
  totalPages,
  activeFiltersCount,
  onPageChange,
}: TransactionsListProps) => {
  const { t } = useTranslation('transactions');

  if (transactions.length === 0) {
    return (
      <p>
        {activeFiltersCount > 0
          ? t('noTransactionsMatchingFilters')
          : 'There are no transactions - TODO add button to create one'}
      </p>
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
