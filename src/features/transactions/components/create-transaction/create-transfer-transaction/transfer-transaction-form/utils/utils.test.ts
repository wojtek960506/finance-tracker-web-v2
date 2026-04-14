import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';

import {
  getDefaultTransferTransactionFormValues,
  getTransferTransactionFormValues,
  transferTransactionFormSchema,
} from './utils';

describe('transfer transaction form utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('validates schema values including different accounts', () => {
    expect(
      transferTransactionFormSchema.parse({
        date: '2024-01-03',
        additionalDescription: 'Move funds',
        amount: '10',
        currency: 'USD',
        paymentMethodId: 'pm-1',
        accountExpenseId: 'acc-1',
        accountIncomeId: 'acc-2',
      }),
    ).toBeTruthy();
  });

  it('returns default values', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T12:00:00Z'));

    expect(getDefaultTransferTransactionFormValues()).toEqual({
      date: '2026-04-08',
      additionalDescription: '',
      amount: '',
      currency: '',
      paymentMethodId: '',
      accountExpenseId: '',
      accountIncomeId: '',
    });
  });

  it('maps a transfer pair to form values', () => {
    const incomeTransaction = makeTransaction({
      id: 'income',
      description: 'Checking --> Savings (Monthly move)',
      transactionType: 'income',
      account: { id: 'acc-income', name: 'Savings', type: 'user' },
      paymentMethod: { id: 'pm-transfer', name: 'Bank transfer', type: 'user' },
    });
    const expenseTransaction = makeTransaction({
      id: 'expense',
      description: 'Checking --> Savings (Monthly move)',
      transactionType: 'expense',
      account: { id: 'acc-expense', name: 'Checking', type: 'user' },
      paymentMethod: { id: 'pm-transfer', name: 'Bank transfer', type: 'user' },
    });

    expect(
      getTransferTransactionFormValues(incomeTransaction, expenseTransaction),
    ).toEqual({
      date: '2024-01-03',
      additionalDescription: 'Monthly move',
      amount: '10',
      currency: 'USD',
      paymentMethodId: 'pm-transfer',
      accountExpenseId: 'acc-expense',
      accountIncomeId: 'acc-income',
    });
  });
});
