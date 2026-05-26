import { describe, expect, it } from 'vitest';

import { getTransactionAmountPresentation } from './transaction-amount';

describe('getTransactionAmountPresentation', () => {
  it('formats amounts with locale-aware grouping separators', () => {
    const expensePresentation = getTransactionAmountPresentation({
      amount: 12345.5,
      currency: 'USD',
      transactionType: 'expense',
      language: 'en-US',
    });
    const incomePresentation = getTransactionAmountPresentation({
      amount: 12345.5,
      currency: 'PLN',
      transactionType: 'income',
      language: 'de-DE',
    });

    expect(expensePresentation.formattedAmount).toBe('-12,345.50 USD');
    expect(incomePresentation.formattedAmount).toBe('+12.345,50 PLN');
  });
});
