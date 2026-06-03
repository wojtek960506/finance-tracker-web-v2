import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { TransactionBackButton } from '@transactions/components/shared';
import type { TransactionKind } from '@transactions/consts';
import { getTransactionsReturnTo } from '@transactions/utils';

import { CreateTransactionCard } from './create-transaction-card';

export type TransactionCardType = { key: TransactionKind | 'bulk' };

const transactionTypeCards: TransactionCardType[] = [
  { key: 'standard' },
  { key: 'transfer' },
  { key: 'exchange' },
  { key: 'bulk' },
] as const;

export const CreateTransaction = () => {
  const location = useLocation();
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);

  return (
    <div className="mx-auto flex max-w-[35rem] flex-col gap-2 sm:gap-3">
      <TransactionBackButton label={t('backToTransactions')} to={returnTo} />

      <CreateTransactionCard
        cardTypes={transactionTypeCards.filter((t) => t.key !== 'bulk')}
        title={t('chooseTransactionKind')}
        description={t('chooseTransactionKindDescription')}
      />

      <CreateTransactionCard
        cardTypes={transactionTypeCards.filter((t) => t.key === 'bulk')}
        title={t('advancedOptions')}
      />
    </div>
  );
};
