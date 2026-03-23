import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';
import type { Transaction } from '@transactions/api';

import { TransactionPreview } from './transaction-preview';

export const TransactionsList = ({ transactions }: { transactions?: Transaction[] }) => {
  const { t } = useTranslation('transactions');

  if (!transactions)
    return <p>There are no transactions - TODO add button to create one</p>;

  return (
    <div className="flex flex-col gap-2 max-w-150 m-auto">
      <Button variant="primary">{t('newTransaction')}</Button>

      <ul className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <TransactionPreview transaction={transaction} key={transaction.id} />
        ))}
      </ul>
    </div>
  );
};
