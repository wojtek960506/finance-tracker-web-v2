import type { Transaction } from '@transactions/api';

export const FIELD_CONTROL_CLASS_NAME = 'rounded-xl px-3 py-2 text-base sm:text-lg';

export const getDefaultTransactionDate = () => new Date().toISOString().slice(0, 10);

export const toOptionalTrimmedString = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue === '' ? undefined : trimmedValue;
};

export const getTransactionDateValue = (value: string) => value.slice(0, 10);

export const getTransactionAmountValue = (value: number) => value.toString();

export const extractAdditionalDescription = (description: string, prefix: string) => {
  if (!description.startsWith(prefix)) return '';

  const suffix = description.slice(prefix.length);

  if (suffix === '') return '';
  if (!suffix.startsWith(' (') || !suffix.endsWith(')')) return '';

  return suffix.slice(2, -1);
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
