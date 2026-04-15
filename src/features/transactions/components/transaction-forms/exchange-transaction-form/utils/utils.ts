import { z } from 'zod';

import type { Transaction } from '@transactions/api';
import {
  extractAdditionalDescription,
  getDefaultTransactionDate,
  getTransactionAmountValue,
  getTransactionDateValue,
  getTransactionPairByType,
} from '@transactions/components/transaction-forms';

export const exchangeTransactionFormSchema = z.object({
  date: z.string().min(1, 'dateRequired'),
  additionalDescription: z.string(),
  amountExpense: z
    .string()
    .min(1, 'amountExpenseRequired')
    .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
    .refine((value) => Number(value) > 0, 'amountPositive'),
  amountIncome: z
    .string()
    .min(1, 'amountIncomeRequired')
    .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
    .refine((value) => Number(value) > 0, 'amountPositive'),
  currencyExpense: z.string().min(1, 'expenseCurrencyRequired'),
  currencyIncome: z.string().min(1, 'incomeCurrencyRequired'),
  paymentMethodId: z.string().min(1, 'paymentMethodRequired'),
  accountId: z.string().min(1, 'accountRequired'),
});

export type ExchangeTransactionFormValues = z.infer<typeof exchangeTransactionFormSchema>;

export const getDefaultExchangeTransactionFormValues =
  (): ExchangeTransactionFormValues => ({
    date: getDefaultTransactionDate(),
    additionalDescription: '',
    amountExpense: '',
    amountIncome: '',
    currencyExpense: '',
    currencyIncome: '',
    paymentMethodId: '',
    accountId: '',
  });

export const getExchangeTransactionFormValues = (
  transaction: Transaction,
  transactionRef: Transaction,
): ExchangeTransactionFormValues => {
  const { expenseTransaction, incomeTransaction } = getTransactionPairByType(
    transaction,
    transactionRef,
  );
  const descriptionPrefix = `${expenseTransaction.currency} -> ${incomeTransaction.currency}`;

  return {
    date: getTransactionDateValue(expenseTransaction.date),
    additionalDescription: extractAdditionalDescription(
      expenseTransaction.description,
      descriptionPrefix,
    ),
    amountExpense: getTransactionAmountValue(expenseTransaction.amount),
    amountIncome: getTransactionAmountValue(incomeTransaction.amount),
    currencyExpense: expenseTransaction.currency,
    currencyIncome: incomeTransaction.currency,
    paymentMethodId: expenseTransaction.paymentMethod.id,
    accountId: expenseTransaction.account.id,
  };
};
