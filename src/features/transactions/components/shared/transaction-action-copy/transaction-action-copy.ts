import type { TFunction } from 'i18next';

import type { Transaction, TrashedTransaction } from '@transactions/api';
import { getTransactionKind } from '@transactions/consts';

type TransactionWithOptionalReference = Transaction | TrashedTransaction;
type TransactionActionKind = 'moveToTrash' | 'restore' | 'permanentDelete';

export const hasLinkedTransaction = (transaction: TransactionWithOptionalReference) =>
  Boolean(transaction.refId);

export const getReferenceActionMessage = (
  transaction: TransactionWithOptionalReference,
  action: TransactionActionKind,
  t: TFunction<'transactions'>,
) => {
  if (!hasLinkedTransaction(transaction)) return null;

  const transactionKind = getTransactionKind(transaction);

  if (transactionKind === 'transfer') {
    return t(`${action}TransferReferenceHint`);
  }

  if (transactionKind === 'exchange') {
    return t(`${action}ExchangeReferenceHint`);
  }

  return null;
};
