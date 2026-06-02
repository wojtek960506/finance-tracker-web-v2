import clsx from 'clsx';

import type { TransactionType } from '@transactions/api';

export type TransactionTypeButtonVariant = 'outline' | 'primary' | 'destructive';

export const getTransactionTypeButtonVariant = (
  transactionType: TransactionType,
  isActive: boolean,
): TransactionTypeButtonVariant => {
  if (!isActive) return 'outline';

  return transactionType === 'expense' ? 'destructive' : 'primary';
};

export const getTransactionTypeButtonClassName = (
  transactionType: TransactionType,
  isActive: boolean,
) =>
  clsx(
    'transition-colors',
    !isActive
      ? transactionType === 'expense'
        ? clsx(
            '!border-destructive/25 !bg-destructive/8 !text-destructive',
            'hover:!bg-destructive/16 focus-visible:!ring-destructive-ring',
          )
        : clsx(
            '!border-bt-primary/25 !bg-bt-primary/8 !text-bt-primary',
            'hover:!bg-bt-primary/16 focus-visible:!ring-bt-primary-ring',
          )
      : '',
  );
