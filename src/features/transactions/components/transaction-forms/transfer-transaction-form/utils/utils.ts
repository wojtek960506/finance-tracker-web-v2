import { z } from 'zod';

import type { Transaction } from '@transactions/api';
import {
  extractAdditionalDescription,
  getDefaultTransactionDate,
  getTransactionAmountValue,
  getTransactionDateValue,
  getTransactionPairByType,
} from '@transactions/components/transaction-forms';

export const transferTransactionFormSchema = z
  .object({
    date: z.string().min(1, 'dateRequired'),
    additionalDescription: z.string(),
    amount: z
      .string()
      .min(1, 'amountRequired')
      .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
      .refine((value) => Number(value) > 0, 'amountPositive'),
    currency: z.string().min(1, 'currencyRequired'),
    paymentMethodId: z.string().min(1, 'paymentMethodRequired'),
    accountExpenseId: z.string().min(1, 'fromAccountRequired'),
    accountIncomeId: z.string().min(1, 'toAccountRequired'),
  })
  .refine((values) => values.accountExpenseId !== values.accountIncomeId, {
    path: ['accountIncomeId'],
    message: 'transferAccountsMustDiffer',
  });

export type TransferTransactionFormValues = z.infer<typeof transferTransactionFormSchema>;

export const getDefaultTransferTransactionFormValues =
  (): TransferTransactionFormValues => ({
    date: getDefaultTransactionDate(),
    additionalDescription: '',
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
  const descriptionPrefix = `${expenseTransaction.account.name} --> ${incomeTransaction.account.name}`;

  return {
    date: getTransactionDateValue(expenseTransaction.date),
    additionalDescription: extractAdditionalDescription(
      expenseTransaction.description,
      descriptionPrefix,
    ),
    amount: getTransactionAmountValue(expenseTransaction.amount),
    currency: expenseTransaction.currency,
    paymentMethodId: expenseTransaction.paymentMethod.id,
    accountExpenseId: expenseTransaction.account.id,
    accountIncomeId: incomeTransaction.account.id,
  };
};
