import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';

import {
  getDefaultStandardTransactionFormValues,
  getStandardTransactionFormValues,
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
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T12:00:00Z'));

    expect(getDefaultStandardTransactionFormValues()).toEqual({
      date: '2026-04-08',
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
});
