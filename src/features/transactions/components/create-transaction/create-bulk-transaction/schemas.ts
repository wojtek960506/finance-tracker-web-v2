import { z } from 'zod';

import {
  exchangeTransactionFormSchema,
  type ExchangeTransactionFormValues,
  investmentTransactionFormSchema,
  type InvestmentTransactionFormValues,
  standardTransactionFormSchema,
  type StandardTransactionFormValues,
  transferTransactionFormSchema,
  type TransferTransactionFormValues,
} from '@transactions/components/transaction-forms';

import { bulkTransactionKinds } from './consts';
import type { BulkTransactionRowValues } from './types';

const getRowValidationDetails = (row: BulkTransactionRowValues) => {
  switch (row.kind) {
    case 'standard':
      return {
        result: standardTransactionFormSchema.safeParse(row.standardValues),
        valuesPath: 'standardValues',
      };
    case 'transfer':
      return {
        result: transferTransactionFormSchema.safeParse(row.transferValues),
        valuesPath: 'transferValues',
      };
    case 'exchange':
      return {
        result: exchangeTransactionFormSchema.safeParse(row.exchangeValues),
        valuesPath: 'exchangeValues',
      };
    case 'investment':
      return {
        result: investmentTransactionFormSchema.safeParse(row.investmentValues),
        valuesPath: 'investmentValues',
      };
    default:
      return null;
  }
};

export const bulkTransactionRowSchema = z
  .object({
    kind: z.enum(['', ...bulkTransactionKinds]),
    standardValues: z.custom<StandardTransactionFormValues>(),
    transferValues: z.custom<TransferTransactionFormValues>(),
    exchangeValues: z.custom<ExchangeTransactionFormValues>(),
    investmentValues: z.custom<InvestmentTransactionFormValues>(),
  })
  .superRefine((row: BulkTransactionRowValues, ctx) => {
    if (row.kind === '') return;

    const validationDetails = getRowValidationDetails(row);
    if (!validationDetails || validationDetails.result.success) return;

    for (const issue of validationDetails.result.error.issues) {
      ctx.addIssue({
        ...issue,
        path: [validationDetails.valuesPath, ...issue.path],
      });
    }
  });

export const bulkTransactionFormSchema = z.object({
  rows: z.array(bulkTransactionRowSchema).min(1),
});
