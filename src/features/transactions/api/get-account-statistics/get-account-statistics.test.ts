import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getAccountStatistics } from './get-account-statistics';

vi.mock('@shared/api', () => ({
  api: { get: vi.fn() },
}));

describe('getAccountStatistics', () => {
  it('gets account statistics from the statistics endpoint', async () => {
    const getMock = vi.mocked(api.get);
    const mockResult = {
      normalizedBaseCurrency: 'PLN',
      normalizedTotalAmount: 120,
      currencies: [
        {
          currency: 'PLN',
          totalAmount: 120,
          totalItems: 4,
          normalizedTotalAmount: 120,
          accounts: [
            {
              accountId: 'account-1',
              accountName: 'Main',
              accountType: 'user',
              totalAmount: 120,
              totalItems: 4,
              normalizedTotalAmount: 120,
            },
          ],
        },
      ],
    };
    getMock.mockResolvedValueOnce({ data: mockResult });

    const result = await getAccountStatistics({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      transactionType: 'income',
      currency: 'pln',
      baseCurrency: 'pln',
    });

    expect(getMock).toHaveBeenCalledWith(
      '/transactions/statistics/accounts?startDate=2024-01-01&endDate=2024-01-31&transactionType=income&currency=PLN&baseCurrency=PLN',
    );
    expect(result).toEqual(mockResult);
  });
});
