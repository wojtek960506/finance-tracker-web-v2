import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getNetWorth, type NetWorthResponseDTO } from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockNetWorthResponse: NetWorthResponseDTO = {
  baseCurrency: 'PLN',
  netWorth: {
    total: 150000,
    liquidCash: 55000,
    investments: 95000,
  },
  byCurrency: {
    PLN: {
      currency: 'PLN',
      cash: 35000,
      investments: 55000,
      total: 90000,
      normalizedTotal: 90000,
    },
    USD: {
      currency: 'USD',
      cash: 5000,
      investments: 10000,
      total: 15000,
      normalizedTotal: 60000,
    },
  },
  allocation: {
    cash: {
      category: 'cash',
      amount: 55000,
      percentage: 36.67,
    },
    share: {
      category: 'share',
      amount: 40000,
      percentage: 26.67,
    },
    termDeposit: {
      category: 'termDeposit',
      amount: 35000,
      percentage: 23.33,
    },
    fund: {
      category: 'fund',
      amount: 20000,
      percentage: 13.33,
    },
  },
};

describe('getNetWorth API', () => {
  it('fetches net worth data without params', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: mockNetWorthResponse });

    const result = await getNetWorth();

    expect(getMock).toHaveBeenCalledWith('/net-worth', {
      params: undefined,
    });
    expect(result).toEqual(mockNetWorthResponse);
  });

  it('fetches net worth data with baseCurrency param', async () => {
    const getMock = vi.mocked(api.get);
    getMock.mockResolvedValueOnce({ data: mockNetWorthResponse });

    const result = await getNetWorth({ baseCurrency: 'PLN' });

    expect(getMock).toHaveBeenCalledWith('/net-worth', {
      params: { baseCurrency: 'PLN' },
    });
    expect(result).toEqual(mockNetWorthResponse);
  });
});
