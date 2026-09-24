import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import { getNetWorthIndependence } from './get-net-worth-independence';
import type { NetWorthIndependenceResponseDTO } from './types';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockIndependenceResponse: NetWorthIndependenceResponseDTO = {
  baseCurrency: 'PLN',
  period: {
    startDate: '2025-09-19T11:20:00.000Z',
    endDate: '2026-09-19T11:20:00.000Z',
    monthsCount: 12,
  },
  netWorth: {
    total: 231200,
    liquidCash: 61200,
    savings: 30000,
    liquidCapital: 91200,
    lockedInvestments: 140000,
  },
  monthlyAverages: {
    grossExpenses: 6000,
    nonWorkIncome: 500,
    workIncome: 12000,
    totalIncome: 12500,
    netBurnRate: 5500,
  },
  independence: {
    netWorthMonths: 42.04,
    liquidCapitalMonths: 16.58,
    liquidCashMonths: 11.13,
    isPerpetual: false,
  },
  zeroIncomeBaseline: {
    netWorthMonths: 38.53,
    liquidCapitalMonths: 15.2,
    liquidCashMonths: 10.2,
  },
  excludedCategories: [
    {
      id: '60d0fe4f5311236168a109ca',
      name: 'Wynagrodzenie / Praca',
    },
  ],
};

describe('getNetWorthIndependence', () => {
  it('calls /net-worth/independence with correct parameters and returns data', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockIndependenceResponse });

    const params = { baseCurrency: 'PLN', periodMonths: 12 };
    const result = await getNetWorthIndependence(params);

    expect(api.get).toHaveBeenCalledWith('/net-worth/independence', {
      params,
    });
    expect(result).toEqual(mockIndependenceResponse);
  });
});
