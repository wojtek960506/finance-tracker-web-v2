import { ExportTransactionsButton } from '@transactions/components/export-transactions';
import { useTransactionsPageContext } from '@transactions/components/transactions-page/context';

import { NewTransactionButton } from './new-transaction-button';
import { ShowFiltersButton } from './show-filters-button';
import { ShowTotalsButton } from './show-totals-button';

export const TransactionsPageMainButtons = () => {
  const { hasNoTransactions } = useTransactionsPageContext();
  const { filters } = useTransactionsPageContext();

  if (hasNoTransactions) return null;

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-3">
      <NewTransactionButton />
      <ExportTransactionsButton filters={filters}/>
      <ShowTotalsButton />
      <ShowFiltersButton />
    </div>
  );
};
