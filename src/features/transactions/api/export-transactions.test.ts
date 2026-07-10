import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { exportTransactions } from './export-transactions';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

describe('exportTransactions', () => {
  it('requests filtered transactions export as a blob', async () => {
    const getMock = vi.mocked(api.get);
    const csv = new Blob(['date,amount']);
    getMock.mockResolvedValueOnce({
      data: csv,
    });

    const result = await exportTransactions({
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

    expect(getMock).toHaveBeenCalledWith(
      '/transactions/export?startDate=2024-01-01&endDate=2024-01-31&minAmount=10&maxAmount=99.5&' +
        'transactionType=expense&currency=USD&categoryIds=cat-3%2Ccat-4&' +
        'excludeCategoryIds=cat-1%2Ccat-2&paymentMethodIds=pm-1%2Cpm-2&' +
        'excludePaymentMethodIds=pm-3&accountIds=acc-1%2Cacc-2&excludeAccountIds=acc-3',
      { responseType: 'blob' },
    );
    expect(result).toEqual({
      csv,
    });
  });
});
