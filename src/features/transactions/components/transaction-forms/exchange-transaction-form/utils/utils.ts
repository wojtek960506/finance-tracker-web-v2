import { z } from 'zod';

import type { Transaction } from '@transactions/api';
import {
  getTransactionAmountValue,
  getTransactionDateValue,
  getTransactionPairByType,
  toOptionalId,
} from '@transactions/components/transaction-forms';

export const exchangeTransactionFormSchema = z
  .object({
    date: z.string().min(1, 'dateRequired'),
    description: z.string().trim().min(1, 'descriptionRequired'),
    amountExpense: z
      .string()
      .min(1, 'amountExpenseRequired')
      .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
      .refine((value) => Number(value) >= 0, 'amountCannotBeNegative'),
    amountIncome: z
      .string()
      .min(1, 'amountIncomeRequired')
      .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
      .refine((value) => Number(value) >= 0, 'amountCannotBeNegative'),
    currencyExpense: z.string().min(1, 'expenseCurrencyRequired'),
    currencyIncome: z.string().min(1, 'incomeCurrencyRequired'),
    paymentMethodId: z.string(),
    accountExpenseId: z.string(),
    accountIncomeId: z.string(),
  })
  .refine((values) => values.currencyExpense !== values.currencyIncome, {
    path: ['currencyIncome'],
    message: 'exchangeCurrenciesMustDiffer',
  });

export type ExchangeTransactionFormValues = z.infer<typeof exchangeTransactionFormSchema>;

export const getDefaultExchangeTransactionFormValues =
  (): ExchangeTransactionFormValues => ({
    date: '',
    description: '',
    amountExpense: '',
    amountIncome: '',
    currencyExpense: '',
    currencyIncome: '',
    paymentMethodId: '',
    accountExpenseId: '',
    accountIncomeId: '',
  });

export const getExchangeTransactionFormValues = (
  transaction: Transaction,
  transactionRef: Transaction,
): ExchangeTransactionFormValues => {
  const { expenseTransaction, incomeTransaction } = getTransactionPairByType(
    transaction,
    transactionRef,
  );

  return {
    date: getTransactionDateValue(expenseTransaction.date),
    description: expenseTransaction.description,
    amountExpense: getTransactionAmountValue(expenseTransaction.amount),
    amountIncome: getTransactionAmountValue(incomeTransaction.amount),
    currencyExpense: expenseTransaction.currency,
    currencyIncome: incomeTransaction.currency,
    paymentMethodId: expenseTransaction.paymentMethod.id,
    accountExpenseId: expenseTransaction.account.id,
    accountIncomeId: incomeTransaction.account.id,
  };
};

export const normalizeExchangeTransactionFormValues = (
  values: ExchangeTransactionFormValues,
) => ({
  ...values,
  description: values.description.trim(),
  paymentMethodId: toOptionalId(values.paymentMethodId),
  accountExpenseId: toOptionalId(values.accountExpenseId),
  accountIncomeId: toOptionalId(values.accountIncomeId),
});
