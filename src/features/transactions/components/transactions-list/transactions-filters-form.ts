import { z } from 'zod';

import type { TransactionFilters, TransactionType } from '@transactions/api';

export type CategoryFilterMode = 'include' | 'exclude';

export type TransactionFiltersFormValues = {
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  transactionType: '' | TransactionType;
  currency: string;
  categoryMode: CategoryFilterMode;
  categoryId: string;
  excludeCategoryIds: string[];
  paymentMethodId: string;
  accountId: string;
};

const optionalNonNegativeNumber = z
  .string()
  .refine((value) => value === '' || !Number.isNaN(Number(value)), 'amountValidNumber')
  .refine((value) => value === '' || Number(value) >= 0, 'amountMustBePositiveOrZero');

export const transactionFiltersFormSchema = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
    minAmount: optionalNonNegativeNumber,
    maxAmount: optionalNonNegativeNumber,
    transactionType: z.enum(['', 'expense', 'income']),
    currency: z.string(),
    categoryMode: z.enum(['include', 'exclude']),
    categoryId: z.string(),
    excludeCategoryIds: z.array(z.string()),
    paymentMethodId: z.string(),
    accountId: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.startDate && values.endDate && values.startDate > values.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'endDateMustNotBeEarlierThanStartDate',
      });
    }

    if (
      values.minAmount &&
      values.maxAmount &&
      Number(values.minAmount) > Number(values.maxAmount)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxAmount'],
        message: 'maxAmountMustNotBeLowerThanMinAmount',
      });
    }
  });

export const getTransactionFiltersFormDefaults = (
  filters: TransactionFilters,
): TransactionFiltersFormValues => ({
  startDate: filters.startDate ?? '',
  endDate: filters.endDate ?? '',
  minAmount: filters.minAmount !== undefined ? String(filters.minAmount) : '',
  maxAmount: filters.maxAmount !== undefined ? String(filters.maxAmount) : '',
  transactionType: filters.transactionType ?? '',
  currency: filters.currency ?? '',
  categoryMode:
    filters.excludeCategoryIds && filters.excludeCategoryIds.length > 0
      ? 'exclude'
      : 'include',
  categoryId: filters.categoryId ?? '',
  excludeCategoryIds: filters.excludeCategoryIds ?? [],
  paymentMethodId: filters.paymentMethodId ?? '',
  accountId: filters.accountId ?? '',
});

export const normalizeTransactionFiltersFormValues = (
  values: TransactionFiltersFormValues,
): TransactionFilters => ({
  startDate: values.startDate || undefined,
  endDate: values.endDate || undefined,
  minAmount: values.minAmount === '' ? undefined : Number(values.minAmount),
  maxAmount: values.maxAmount === '' ? undefined : Number(values.maxAmount),
  transactionType: values.transactionType || undefined,
  currency: values.currency || undefined,
  categoryId:
    values.categoryMode === 'include' && values.categoryId
      ? values.categoryId
      : undefined,
  excludeCategoryIds:
    values.categoryMode === 'exclude' && values.excludeCategoryIds.length > 0
      ? values.excludeCategoryIds
      : undefined,
  paymentMethodId: values.paymentMethodId || undefined,
  accountId: values.accountId || undefined,
});
