import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getTransactionTotals } from './get-transaction-totals';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

describe('getTransactionTotals', () => {
  it('gets totals without pagination params', async () => {
    const getMock = vi.mocked(api.get);
    const mockResult = {
      overall: {
        totalItems: 0,
        expense: { totalItems: 0 },
        income: { totalItems: 0 },
      },
      byCurrency: {},
    };
    getMock.mockResolvedValueOnce({ data: mockResult });

    const result = await getTransactionTotals();

    expect(getMock).toHaveBeenCalledWith('/transactions/totals');
    expect(result).toEqual(mockResult);
  });

  it('includes backend-supported filters in the request', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({
      data: {
        overall: {
          totalItems: 0,
          expense: { totalItems: 0 },
          income: { totalItems: 0 },
        },
        byCurrency: {},
      },
    });
    const query =
      'startDate=2024-01-01&endDate=2024-01-31&minAmount=10&maxAmount=99.5&' +
      'transactionType=expense&currency=USD&categoryIds=cat-3%2Ccat-4&' +
      'excludeCategoryIds=cat-1%2Ccat-2&paymentMethodIds=pm-1%2Cpm-2&' +
      'excludePaymentMethodIds=pm-3&accountIds=acc-1%2Cacc-2&excludeAccountIds=acc-3';

    await getTransactionTotals({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      minAmount: 10,
      maxAmount: 99.5,
      transactionType: 'expense',
      currency: 'USD',
      categoryIds: ['cat-3', 'cat-4'],
      excludeCategoryIds: ['cat-1', 'cat-2'],
      paymentMethodIds: ['pm-1', 'pm-2'],
      excludePaymentMethodIds: ['pm-3'],
      accountIds: ['acc-1', 'acc-2'],
      excludeAccountIds: ['acc-3'],
    });

    expect(getMock).toHaveBeenCalledWith(`/transactions/totals?${query}`);
  });
});
