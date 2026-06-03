import clsx from 'clsx';

import type { TransactionType } from '@transactions/api';

// TODO try to unify those 2 styling methods with `getTransactionTypeButtonClassName`

export const getTransactionTypeSelectItemClassName = (transactionType: TransactionType) =>
  clsx(
    'transition-colors',
    transactionType === 'expense'
      ? clsx(
          'text-destructive',
          'data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive',
          'data-[state=checked]:!bg-destructive/15 data-[state=checked]:!text-destructive',
        )
      : clsx(
          'text-bt-primary',
          'data-[highlighted]:bg-bt-primary/10 data-[highlighted]:text-bt-primary',
          'data-[state=checked]:!bg-bt-primary/15 data-[state=checked]:!text-bt-primary',
        ),
  );

export const getTransactionTypeSelectValueClassName = (
  transactionType: TransactionType | '',
) =>
  clsx(
    transactionType === 'expense'
      ? clsx(
          'border-destructive/25 bg-destructive/8 text-destructive',
          'hover:bg-destructive/16 focus-visible:ring-destructive-ring',
        )
      : transactionType === 'income'
        ? clsx(
            '!border-bt-primary/25 !bg-bt-primary/8 !text-bt-primary',
            'hover:!bg-bt-primary/16 focus-visible:!ring-bt-primary-ring',
          )
        : '',
  );
