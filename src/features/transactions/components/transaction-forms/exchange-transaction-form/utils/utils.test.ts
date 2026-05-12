import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';

import {
  exchangeTransactionFormSchema,
  getDefaultExchangeTransactionFormValues,
  getExchangeTransactionFormValues,
  normalizeExchangeTransactionFormValues,
} from './utils';

describe('exchange transaction form utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('validates schema values', () => {
    expect(
      exchangeTransactionFormSchema.parse({
        date: '2024-01-03',
        description: 'Exchange',
        amountExpense: '10',
        amountIncome: '8',
        currencyExpense: 'USD',
        currencyIncome: 'EUR',
        paymentMethodId: 'pm-1',
        accountExpenseId: 'acc-1',
        accountIncomeId: 'acc-2',
      }),
    ).toBeTruthy();
  });

  it('returns default values', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T12:00:00Z'));

    expect(getDefaultExchangeTransactionFormValues()).toEqual({
      date: '2026-04-08',
      description: '',
      amountExpense: '',
      amountIncome: '',
      currencyExpense: '',
      currencyIncome: '',
      paymentMethodId: '',
      accountExpenseId: '',
      accountIncomeId: '',
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
      description: 'USD -> EUR (Vacation cash)',
      amountExpense: '10',
      amountIncome: '8',
      currencyExpense: 'USD',
      currencyIncome: 'EUR',
      paymentMethodId: 'pm-exchange',
      accountExpenseId: 'acc-exchange',
      accountIncomeId: 'acc-exchange',
    });
  });

  it('normalizes optional ids and trims description', () => {
    expect(
      normalizeExchangeTransactionFormValues({
        date: '2024-01-03',
        description: '  Exchange  ',
        amountExpense: '10',
        amountIncome: '8',
        currencyExpense: 'USD',
        currencyIncome: 'EUR',
        paymentMethodId: '',
        accountExpenseId: 'acc-1',
        accountIncomeId: '  ',
      }),
    ).toEqual({
      date: '2024-01-03',
      description: 'Exchange',
      amountExpense: '10',
      amountIncome: '8',
      currencyExpense: 'USD',
      currencyIncome: 'EUR',
      paymentMethodId: undefined,
      accountExpenseId: 'acc-1',
      accountIncomeId: undefined,
    });
  });
});
