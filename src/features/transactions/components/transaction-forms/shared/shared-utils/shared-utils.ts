import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

import { FORM_CONTROL_SIZE_CLASS } from '@shared/consts';
import type { Transaction } from '@transactions/api';

export const FIELD_CONTROL_CLASS_NAME = FORM_CONTROL_SIZE_CLASS;
export const REQUIRED_LABEL_CLASS_NAME =
  "after:ml-1 after:text-destructive after:content-['*']";

export const getDefaultTransactionDate = () => new Date().toISOString().slice(0, 10);

export const toOptionalTrimmedString = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue === '' ? undefined : trimmedValue;
};

export const toOptionalId = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue === '' ? undefined : trimmedValue;
};

export const getTransactionDateValue = (value: string) => value.slice(0, 10);

export const getTransactionAmountValue = (value: number) => value.toString();

export const preventImplicitFormSubmit = (
  event: ReactKeyboardEvent<HTMLFormElement>,
) => {
  if (
    event.key !== 'Enter' ||
    event.shiftKey ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.nativeEvent.isComposing
  ) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.closest('button[type="submit"], input[type="submit"], textarea')) {
    return;
  }

  if (target.closest('button, [role="button"], a[href]')) {
    return;
  }

  event.preventDefault();
};

export const getTransactionPairByType = (
  transaction: Transaction,
  transactionRef: Transaction,
) =>
  transaction.transactionType === 'expense'
    ? {
        expenseTransaction: transaction,
        incomeTransaction: transactionRef,
      }
    : {
        expenseTransaction: transactionRef,
        incomeTransaction: transaction,
      };
