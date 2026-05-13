import { z } from 'zod';

import type { NamedResourceKind } from '@named-resources/api';
import type { TransactionFilters, TransactionType } from '@transactions/api';

export type NamedResourceFilterMode = 'include' | 'exclude';

export type TransactionFiltersFormValues = {
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  transactionType: '' | TransactionType;
  currency: string;
  categoryMode: NamedResourceFilterMode;
  categoryIds: string[];
  excludeCategoryIds: string[];
  paymentMethodMode: NamedResourceFilterMode;
  paymentMethodIds: string[];
  excludePaymentMethodIds: string[];
  accountMode: NamedResourceFilterMode;
  accountIds: string[];
  excludeAccountIds: string[];
};

export const TRANSACTION_FILTER_RESOURCE_FIELD_NAMES = {
  categories: {
    mode: 'categoryMode',
    include: 'categoryIds',
    exclude: 'excludeCategoryIds',
  },
  paymentMethods: {
    mode: 'paymentMethodMode',
    include: 'paymentMethodIds',
    exclude: 'excludePaymentMethodIds',
  },
  accounts: {
    mode: 'accountMode',
    include: 'accountIds',
    exclude: 'excludeAccountIds',
  },
} as const satisfies Record<
  NamedResourceKind,
  {
    mode: keyof TransactionFiltersFormValues;
    include: keyof TransactionFiltersFormValues;
    exclude: keyof TransactionFiltersFormValues;
  }
>;

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
    categoryIds: z.array(z.string()),
    excludeCategoryIds: z.array(z.string()),
    paymentMethodMode: z.enum(['include', 'exclude']),
    paymentMethodIds: z.array(z.string()),
    excludePaymentMethodIds: z.array(z.string()),
    accountMode: z.enum(['include', 'exclude']),
    accountIds: z.array(z.string()),
    excludeAccountIds: z.array(z.string()),
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
    filters.excludeCategoryIds && filters.excludeCategoryIds.length > 0 ? 'exclude' : 'include',
  categoryIds: filters.categoryIds ?? [],
  excludeCategoryIds: filters.excludeCategoryIds ?? [],
  paymentMethodMode:
    filters.excludePaymentMethodIds && filters.excludePaymentMethodIds.length > 0
      ? 'exclude'
      : 'include',
  paymentMethodIds: filters.paymentMethodIds ?? [],
  excludePaymentMethodIds: filters.excludePaymentMethodIds ?? [],
  accountMode:
    filters.excludeAccountIds && filters.excludeAccountIds.length > 0 ? 'exclude' : 'include',
  accountIds: filters.accountIds ?? [],
  excludeAccountIds: filters.excludeAccountIds ?? [],
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
  categoryIds:
    values.categoryMode === 'include' && values.categoryIds.length > 0
      ? values.categoryIds
      : undefined,
  excludeCategoryIds:
    values.categoryMode === 'exclude' && values.excludeCategoryIds.length > 0
      ? values.excludeCategoryIds
      : undefined,
  paymentMethodIds:
    values.paymentMethodMode === 'include' && values.paymentMethodIds.length > 0
      ? values.paymentMethodIds
      : undefined,
  excludePaymentMethodIds:
    values.paymentMethodMode === 'exclude' && values.excludePaymentMethodIds.length > 0
      ? values.excludePaymentMethodIds
      : undefined,
  accountIds:
    values.accountMode === 'include' && values.accountIds.length > 0
      ? values.accountIds
      : undefined,
  excludeAccountIds:
    values.accountMode === 'exclude' && values.excludeAccountIds.length > 0
      ? values.excludeAccountIds
      : undefined,
});
