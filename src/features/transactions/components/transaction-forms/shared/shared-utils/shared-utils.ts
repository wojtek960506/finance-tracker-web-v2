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
