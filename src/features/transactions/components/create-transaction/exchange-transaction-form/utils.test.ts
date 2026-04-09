import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';

import {
  exchangeTransactionFormSchema,
  getDefaultExchangeTransactionFormValues,
  getExchangeTransactionFormValues,
} from './utils';

describe('exchange transaction form utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('validates schema values', () => {
    expect(
      exchangeTransactionFormSchema.parse({
        date: '2024-01-03',
        additionalDescription: 'Exchange',
        amountExpense: '10',
        amountIncome: '8',
        currencyExpense: 'USD',
        currencyIncome: 'EUR',
        paymentMethodId: 'pm-1',
        accountId: 'acc-1',
      }),
    ).toBeTruthy();
  });

  it('returns default values', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T12:00:00Z'));

    expect(getDefaultExchangeTransactionFormValues()).toEqual({
      date: '2026-04-08',
      additionalDescription: '',
      amountExpense: '',
      amountIncome: '',
      currencyExpense: '',
      currencyIncome: '',
      paymentMethodId: '',
      accountId: '',
    });
  });

  it('maps an exchange pair to form values', () => {
    const incomeTransaction = makeTransaction({
      id: 'income',
      description: 'USD -> EUR (Vacation cash)',
      transactionType: 'income',
      amount: 8,
      currency: 'EUR',
      paymentMethod: { id: 'pm-exchange', name: 'Cash', type: 'user' },
      account: { id: 'acc-exchange', name: 'Wallet', type: 'user' },
    });
    const expenseTransaction = makeTransaction({
      id: 'expense',
      description: 'USD -> EUR (Vacation cash)',
      transactionType: 'expense',
      amount: 10,
      currency: 'USD',
      paymentMethod: { id: 'pm-exchange', name: 'Cash', type: 'user' },
      account: { id: 'acc-exchange', name: 'Wallet', type: 'user' },
    });

    expect(
      getExchangeTransactionFormValues(incomeTransaction, expenseTransaction),
    ).toEqual({
      date: '2024-01-03',
      additionalDescription: 'Vacation cash',
      amountExpense: '10',
      amountIncome: '8',
      currencyExpense: 'USD',
      currencyIncome: 'EUR',
      paymentMethodId: 'pm-exchange',
      accountId: 'acc-exchange',
    });
  });
});
