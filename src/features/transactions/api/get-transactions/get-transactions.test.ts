import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getTransactions } from './get-transactions';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

const id = 'some id';
const mockResult = [{ id }];

describe('getTransactions', () => {
  it('gets first page by default', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: mockResult });
    const query = 'page=1&limit=30&sortBy=date&sortOrder=desc';

    const result = await getTransactions();

    expect(getMock).toHaveBeenCalledWith(`/transactions?${query}`);
    expect(result).toEqual(mockResult);
  });

  it('gets requested page', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: mockResult });
    const query = 'page=4&limit=30&sortBy=date&sortOrder=desc';

    await getTransactions(4);

    expect(getMock).toHaveBeenCalledWith(`/transactions?${query}`);
  });

  it('includes backend-supported filters in the request', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: mockResult });
    const query =
      'page=2&limit=30&sortBy=date&sortOrder=desc&startDate=2024-01-01&endDate=2024-01-31&' +
      'minAmount=10&maxAmount=99.5&transactionType=expense&currency=USD&' +
      'categoryIds=cat-3%2Ccat-4&excludeCategoryIds=cat-1%2Ccat-2&paymentMethodIds=pm-1%2Cpm-2&' +
      'excludePaymentMethodIds=pm-3&accountIds=acc-1%2Cacc-2&excludeAccountIds=acc-3';

    await getTransactions({
      page: 2,
      filters: {
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
      },
    });

    expect(getMock).toHaveBeenCalledWith(`/transactions?${query}`);
  });
});
