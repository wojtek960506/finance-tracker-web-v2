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
      currencies: [
        {
          currency: 'PLN',
          totalAmount: 120,
          totalItems: 4,
          accounts: [
            {
              accountId: 'account-1',
              accountName: 'Main',
              accountType: 'user',
              totalAmount: 120,
              totalItems: 4,
            },
          ],
        },
      ],
    };
    getMock.mockResolvedValueOnce({ data: mockResult });

    const result = await getAccountStatistics();

    expect(getMock).toHaveBeenCalledWith('/transactions/statistics/accounts');
    expect(result).toEqual(mockResult);
  });
});
