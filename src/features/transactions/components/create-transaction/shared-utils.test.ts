import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeTransaction } from '@test-utils/factories/transaction';

import {
  extractAdditionalDescription,
  FIELD_CONTROL_CLASS_NAME,
  getDefaultTransactionDate,
  getTransactionAmountValue,
  getTransactionDateValue,
  getTransactionPairByType,
  toOptionalTrimmedString,
} from './shared-utils';

describe('transaction shared utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the shared control class name', () => {
    expect(FIELD_CONTROL_CLASS_NAME).toContain('rounded-xl');
  });

  it('returns today as the default transaction date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-08T12:00:00Z'));

    expect(getDefaultTransactionDate()).toBe('2026-04-08');
  });

  it('trims optional strings and removes empty values', () => {
    expect(toOptionalTrimmedString('  note  ')).toBe('note');
    expect(toOptionalTrimmedString('   ')).toBeUndefined();
  });

  it('formats transaction date and amount values for forms', () => {
    expect(getTransactionDateValue('2024-01-03T10:20:30.000Z')).toBe('2024-01-03');
    expect(getTransactionAmountValue(10.5)).toBe('10.5');
  });

  it('extracts the additional description only when the prefix and wrapper match', () => {
    expect(extractAdditionalDescription('USD -> EUR (Vacation cash)', 'USD -> EUR')).toBe(
      'Vacation cash',
    );
    expect(extractAdditionalDescription('Other text', 'USD -> EUR')).toBe('');
    expect(extractAdditionalDescription('USD -> EUR', 'USD -> EUR')).toBe('');
    expect(extractAdditionalDescription('USD -> EUR - note', 'USD -> EUR')).toBe('');
  });

  it('returns the pair in expense/income order', () => {
    const expenseTransaction = makeTransaction({
      id: 'expense',
      transactionType: 'expense',
    });
    const incomeTransaction = makeTransaction({
      id: 'income',
      transactionType: 'income',
    });

    expect(getTransactionPairByType(expenseTransaction, incomeTransaction)).toEqual({
      expenseTransaction,
      incomeTransaction,
    });

    expect(getTransactionPairByType(incomeTransaction, expenseTransaction)).toEqual({
      expenseTransaction,
      incomeTransaction,
    });
  });
});
