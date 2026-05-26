import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';

import {
  getDefaultTransferTransactionFormValues,
  getTransferTransactionFormValues,
  normalizeTransferTransactionFormValues,
  transferTransactionFormSchema,
} from './utils';

describe('transfer transaction form utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows the same account on both sides of a transfer', () => {
    expect(
      transferTransactionFormSchema.parse({
        date: '2024-01-03',
        description: 'Move funds',
        amount: '10',
        currency: 'USD',
        paymentMethodId: 'pm-1',
        accountExpenseId: 'acc-1',
        accountIncomeId: 'acc-1',
      }),
    ).toBeTruthy();
  });

  it('returns default values', () => {
    expect(getDefaultTransferTransactionFormValues()).toEqual({
      date: '',
      description: '',
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
      description: 'Checking --> Savings (Monthly move)',
      amount: '10',
      currency: 'USD',
      paymentMethodId: 'pm-transfer',
      accountExpenseId: 'acc-expense',
      accountIncomeId: 'acc-income',
    });
  });

  it('normalizes optional ids and trims description', () => {
    expect(
      normalizeTransferTransactionFormValues({
        date: '2024-01-03',
        description: '  Move funds  ',
        amount: '10',
        currency: 'USD',
        paymentMethodId: '',
        accountExpenseId: '  ',
        accountIncomeId: 'acc-2',
      }),
    ).toEqual({
      date: '2024-01-03',
      description: 'Move funds',
      amount: '10',
      currency: 'USD',
      paymentMethodId: undefined,
      accountExpenseId: undefined,
      accountIncomeId: 'acc-2',
    });
  });
});
