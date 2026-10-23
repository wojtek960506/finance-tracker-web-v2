import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  dashboardKeys,
  type DashboardSummaryResponseDTO,
  getDashboardSummary,
} from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockSummary: DashboardSummaryResponseDTO = {
  baseCurrency: 'PLN',
  transactions: {
    totalItems: 42,
    totalExpenseAmount: 3200,
    totalIncomeAmount: 6500,
    byCurrency: {
      PLN: {
        totalItems: 42,
        totalExpenseAmount: 3200,
        totalIncomeAmount: 6500,
      },
    },
  },
  investments: {
    totalCurrentValue: 50000,
    totalNetInvested: 45000,
    totalPnL: 5000,
    roiPercentage: 11.11,
    instrumentsCount: 5,
  },
  vehicles: {
    totalVehicles: 2,
    totalSpentPln: 4200,
    totalFuelSpentPln: 2500,
    totalMaintenanceSpentPln: 1500,
    totalEquipmentSpentPln: 200,
  },
  sports: {
    totalCostPln: 950,
    totalEntries: 20,
    categoriesCount: 2,
  },
  recentTransactions: [],
};

describe('Dashboard API', () => {
  it('getDashboardSummary calls GET /dashboard/summary without params', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockSummary });

    const result = await getDashboardSummary();

    expect(api.get).toHaveBeenCalledWith('/dashboard/summary', {
      params: undefined,
    });
    expect(result).toEqual(mockSummary);
  });

  it('getDashboardSummary passes query parameters', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockSummary });

    const params = { baseCurrency: 'EUR' as const, recentLimit: 5 };
    const result = await getDashboardSummary(params);

    expect(api.get).toHaveBeenCalledWith('/dashboard/summary', { params });
    expect(result).toEqual(mockSummary);
  });

  it('generates correct query keys', () => {
    expect(dashboardKeys.all).toEqual(['dashboard']);
    expect(dashboardKeys.summary()).toEqual(['dashboard', 'summary', {}]);
    expect(dashboardKeys.summary({ recentLimit: 10 })).toEqual([
      'dashboard',
      'summary',
      { recentLimit: 10 },
    ]);
  });
});
