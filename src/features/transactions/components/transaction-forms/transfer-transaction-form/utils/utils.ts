import { z } from 'zod';

import type { Transaction } from '@transactions/api';
import {
  getTransactionAmountValue,
  getTransactionDateValue,
  getTransactionPairByType,
  toOptionalId,
} from '@transactions/components/transaction-forms';

export const transferTransactionFormSchema = z
  .object({
    date: z.string().min(1, 'dateRequired'),
    description: z.string().trim().min(1, 'descriptionRequired'),
    amount: z
      .string()
      .min(1, 'amountRequired')
      .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
      .refine((value) => Number(value) > 0, 'amountPositive'),
    currency: z.string().min(1, 'currencyRequired'),
    paymentMethodId: z.string(),
    accountExpenseId: z.string(),
    accountIncomeId: z.string(),
  });

export type TransferTransactionFormValues = z.infer<typeof transferTransactionFormSchema>;

export const getDefaultTransferTransactionFormValues =
  (): TransferTransactionFormValues => ({
    date: '',
    description: '',
    amount: '',
    currency: '',
    paymentMethodId: '',
    accountExpenseId: '',
    accountIncomeId: '',
  });

export const getTransferTransactionFormValues = (
  transaction: Transaction,
  transactionRef: Transaction,
): TransferTransactionFormValues => {
  const { expenseTransaction, incomeTransaction } = getTransactionPairByType(
    transaction,
    transactionRef,
  );

  return {
    date: getTransactionDateValue(expenseTransaction.date),
    description: expenseTransaction.description,
    amount: getTransactionAmountValue(expenseTransaction.amount),
    currency: expenseTransaction.currency,
    paymentMethodId: expenseTransaction.paymentMethod.id,
    accountExpenseId: expenseTransaction.account.id,
    accountIncomeId: incomeTransaction.account.id,
  };
};

export const normalizeTransferTransactionFormValues = (
  values: TransferTransactionFormValues,
) => ({
  ...values,
  description: values.description.trim(),
  paymentMethodId: toOptionalId(values.paymentMethodId),
  accountExpenseId: toOptionalId(values.accountExpenseId),
  accountIncomeId: toOptionalId(values.accountIncomeId),
});
