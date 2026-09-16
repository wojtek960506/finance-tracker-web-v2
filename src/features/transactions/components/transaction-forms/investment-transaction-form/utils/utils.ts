import { z } from 'zod';

import type { Transaction } from '@transactions/api';
import {
  getTransactionAmountValue,
  getTransactionDateValue,
  toOptionalId,
} from '@transactions/components/transaction-forms';

export type InvestmentOperationKind = 'buy' | 'sell' | 'interest' | 'fee';

export const INVESTMENT_OPERATION_KINDS: InvestmentOperationKind[] = [
  'buy',
  'sell',
  'interest',
  'fee',
];

export const investmentTransactionFormSchema = z.object({
  date: z.string().min(1, 'dateRequired'),
  description: z.string().trim().min(1, 'descriptionRequired'),
  amount: z
    .string()
    .min(1, 'amountRequired')
    .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
    .refine((value) => Number(value) >= 0, 'amountCannotBeNegative'),
  currency: z.string().min(1, 'currencyRequired'),
  paymentMethodId: z.string(),
  accountId: z.string(),
  operationKind: z.enum(['buy', 'sell', 'interest', 'fee']),
  instrumentId: z.string().min(1, 'instrumentRequired'),
  note: z.string().optional(),
});

export type InvestmentTransactionFormValues = z.infer<
  typeof investmentTransactionFormSchema
>;

export const getDefaultInvestmentTransactionFormValues = (
  initialValues: Partial<InvestmentTransactionFormValues> = {},
): InvestmentTransactionFormValues => ({
  date: '',
  description: '',
  amount: '',
  currency: '',
  paymentMethodId: '',
  accountId: '',
  operationKind: 'buy',
  instrumentId: '',
  note: '',
  ...initialValues,
});

export const getInvestmentTransactionFormValues = (
  transaction: Transaction,
): InvestmentTransactionFormValues => {
  const investment =
    transaction.kind === 'investment' ? transaction.investment : undefined;

  return {
    date: getTransactionDateValue(transaction.date),
    description: transaction.description,
    amount: getTransactionAmountValue(transaction.amount),
    currency: transaction.currency,
    paymentMethodId: transaction.paymentMethod.id,
    accountId: transaction.account.id,
    operationKind: investment?.operationKind ?? 'buy',
    instrumentId: investment?.instrument.id ?? '',
    note: investment?.note ?? '',
  };
};

export const normalizeInvestmentTransactionFormValues = (
  values: InvestmentTransactionFormValues,
) => ({
  date: values.date,
  description: values.description.trim(),
  amount: Number(values.amount),
  currency: values.currency,
  paymentMethodId: toOptionalId(values.paymentMethodId),
  accountId: toOptionalId(values.accountId),
  investment: {
    operationKind: values.operationKind,
    instrumentId: values.instrumentId,
    note: values.note ? values.note.trim() : undefined,
  },
});
