import { z } from 'zod';

import type { Transaction, TransactionType } from '@transactions/api';
import {
  getTransactionAmountValue,
  getTransactionDateValue,
  toOptionalId,
} from '@transactions/components/transaction-forms';

export const standardTransactionFormSchema = z.object({
  date: z.string().min(1, 'dateRequired'),
  description: z.string().trim().min(1, 'descriptionRequired'),
  amount: z
    .string()
    .min(1, 'amountRequired')
    .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
    .refine((value) => Number(value) > 0, 'amountPositive'),
  currency: z.string().min(1, 'currencyRequired'),
  categoryId: z.string(),
  paymentMethodId: z.string(),
  accountId: z.string(),
  transactionType: z.enum(['expense', 'income']),
});

export type StandardTransactionFormValues = z.infer<typeof standardTransactionFormSchema>;

export const standardTransactionTypeOptions: TransactionType[] = ['expense', 'income'];

export const getDefaultStandardTransactionFormValues =
  (): StandardTransactionFormValues => ({
    date: '',
    description: '',
    amount: '',
    currency: '',
    categoryId: '',
    paymentMethodId: '',
    accountId: '',
    transactionType: 'expense',
  });

export const getStandardTransactionFormValues = (
  transaction: Transaction,
): StandardTransactionFormValues => ({
  date: getTransactionDateValue(transaction.date),
  description: transaction.description,
  amount: getTransactionAmountValue(transaction.amount),
  currency: transaction.currency,
  categoryId: transaction.category.id,
  paymentMethodId: transaction.paymentMethod.id,
  accountId: transaction.account.id,
  transactionType: transaction.transactionType,
});

export const normalizeStandardTransactionFormValues = (
  values: StandardTransactionFormValues,
) => ({
  ...values,
  categoryId: toOptionalId(values.categoryId),
  paymentMethodId: toOptionalId(values.paymentMethodId),
  accountId: toOptionalId(values.accountId),
});
