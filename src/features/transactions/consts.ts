import type { Transaction } from '@transactions/api';

export const TRANSFER_CATEGORY = 'myAccount';
export const EXCHANGE_CATEGORY = 'exchange';

export type TransactionKind = 'standard' | 'transfer' | 'exchange';

export const getTransactionKind = (
  transaction: Pick<Transaction, 'category'>,
): TransactionKind => {
  const isSystemCategory = transaction.category.type === 'system';

  if (isSystemCategory && transaction.category.name === TRANSFER_CATEGORY) {
    return 'transfer';
  }

  if (isSystemCategory && transaction.category.name === EXCHANGE_CATEGORY) {
    return 'exchange';
  }

  return 'standard';
};
