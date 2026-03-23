import type { Transaction } from '@transactions/api';

import { TransactionPreview } from './transaction-preview';

export const TransactionsList = ({ transactions }: { transactions?: Transaction[] }) => {
  if (!transactions)
    return <p>There are no transactions - TODO add button to create one</p>;

  return (
    <ul className="flex flex-col gap-2 max-w-150 m-auto">
      {transactions.map((transaction) => (
        <TransactionPreview transaction={transaction} key={transaction.id} />
      ))}
    </ul>
  );
};
