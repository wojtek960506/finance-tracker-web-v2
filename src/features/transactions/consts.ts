export const TRANSFER_CATEGORY = 'myAccount';
export const EXCHANGE_CATEGORY = 'exchange';

export type TransactionKind = 'standard' | 'transfer' | 'exchange' | 'investment';

export const getTransactionKind = (transaction: {
  kind?: TransactionKind;
}): TransactionKind => transaction.kind ?? 'standard';
