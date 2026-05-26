import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';

import {
  getDefaultStandardTransactionFormValues,
  getStandardTransactionFormValues,
  normalizeStandardTransactionFormValues,
  standardTransactionFormSchema,
  standardTransactionTypeOptions,
} from './utils';

describe('standard transaction form utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('validates schema values and exposes transaction type options', () => {
    expect(
      standardTransactionFormSchema.parse({
        date: '2024-01-03',
        description: 'Groceries',
        amount: '10',
        currency: 'USD',
        categoryId: 'cat-1',
        paymentMethodId: 'pm-1',
        accountId: 'acc-1',
        transactionType: 'income',
      }),
    ).toBeTruthy();

    expect(standardTransactionTypeOptions).toEqual(['expense', 'income']);
  });

  it('returns default values', () => {
    expect(getDefaultStandardTransactionFormValues()).toEqual({
      date: '',
      description: '',
      amount: '',
      currency: '',
      categoryId: '',
      paymentMethodId: '',
      accountId: '',
      transactionType: 'expense',
    });
  });

  it('maps a transaction to standard form values', () => {
    expect(getStandardTransactionFormValues(makeTransaction())).toEqual({
      date: '2024-01-03',
      description: 'Test transaction',
      amount: '10',
      currency: 'USD',
      categoryId: 'cat-1',
      paymentMethodId: 'pm-1',
      accountId: 'acc-1',
      transactionType: 'expense',
    });
  });

  it('normalizes optional ids', () => {
    expect(
      normalizeStandardTransactionFormValues({
        date: '2024-01-03',
        description: 'Groceries',
        amount: '10',
        currency: 'USD',
        categoryId: '',
        paymentMethodId: 'pm-1',
        accountId: '  ',
        transactionType: 'expense',
      }),
    ).toEqual({
      date: '2024-01-03',
      description: 'Groceries',
      amount: '10',
      currency: 'USD',
      categoryId: undefined,
      paymentMethodId: 'pm-1',
      accountId: undefined,
      transactionType: 'expense',
    });
  });
});
