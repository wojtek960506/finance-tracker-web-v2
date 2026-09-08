import type { Transaction } from '@transactions/api';

export const TRANSFER_CATEGORY = 'myAccount';
export const EXCHANGE_CATEGORY = 'exchange';

export type TransactionKind = 'standard' | 'transfer' | 'exchange' | 'investment';

export const getTransactionKind = (transaction: {
  kind?: TransactionKind;
  category?: Transaction['category'];
}): TransactionKind => {
  if (transaction.kind) {
    return transaction.kind;
  }

  // TODO: Remove this category fallback once all legacy test mocks strictly supply `kind`.
  // Production API objects always return an explicit `kind` attribute.
  if (transaction.category) {
    const isSystemCategory = transaction.category.type === 'system';

    if (isSystemCategory && transaction.category.name === TRANSFER_CATEGORY) {
      return 'transfer';
    }

    if (isSystemCategory && transaction.category.name === EXCHANGE_CATEGORY) {
      return 'exchange';
    }
  }

  return 'standard';
};
