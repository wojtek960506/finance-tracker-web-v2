import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { NetWorthIndependenceResponseDTO } from '@features/net-worth/api';
import * as netWorthApi from '@features/net-worth/api';
import { DEFAULT_BASE_CURRENCY, useSettingsStore } from '@store/settings-store';
import { renderWithProviders } from '@test-utils';

import { FinancialIndependencePage } from './financial-independence-page';

const mockIndependenceData: NetWorthIndependenceResponseDTO = {
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

const mockEmptyIndependenceData: NetWorthIndependenceResponseDTO = {
  baseCurrency: 'PLN',
  period: {
    startDate: '2025-09-19T11:20:00.000Z',
    endDate: '2026-09-19T11:20:00.000Z',
    monthsCount: 12,
  },
  netWorth: {
    total: 0,
    liquidCash: 0,
    savings: 0,
    liquidCapital: 0,
    lockedInvestments: 0,
  },
  monthlyAverages: {
    grossExpenses: 0,
    nonWorkIncome: 0,
    workIncome: 0,
    totalIncome: 0,
    netBurnRate: 0,
  },
  independence: {
    netWorthMonths: null,
    liquidCapitalMonths: null,
    liquidCashMonths: null,
    isPerpetual: false,
  },
  zeroIncomeBaseline: {
    netWorthMonths: null,
    liquidCapitalMonths: null,
    liquidCashMonths: null,
  },
  excludedCategories: [],
};

vi.mock('@features/net-worth/api', async () => {
  const actual = await vi.importActual('@features/net-worth/api');
  return {
    ...actual,
    getNetWorthIndependence: vi.fn(),
  };
});

describe('FinancialIndependencePage', () => {
  beforeEach(() => {
    useSettingsStore.setState({ baseCurrency: DEFAULT_BASE_CURRENCY });
  });

  it('renders empty state when there is no data', async () => {
    vi.mocked(netWorthApi.getNetWorthIndependence).mockResolvedValueOnce(
      mockEmptyIndependenceData,
    );

    renderWithProviders(<FinancialIndependencePage />);

    expect(await screen.findByTestId('net-worth-empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('net-worth-independence-cards')).not.toBeInTheDocument();
  });

  it('renders metric cards, controls, and breakdown when data is loaded', async () => {
    vi.mocked(netWorthApi.getNetWorthIndependence).mockResolvedValueOnce(
      mockIndependenceData,
    );

    renderWithProviders(<FinancialIndependencePage />);

    expect(await screen.findByTestId('net-worth-independence-cards')).toBeInTheDocument();
    expect(screen.getByTestId('net-worth-independence-breakdown')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Financial Independence & Safety Runway',
      }),
    ).toBeInTheDocument();
  });

  it('allows switching analysis period and uses base currency from settings store', async () => {
    useSettingsStore.setState({ baseCurrency: 'EUR' });
    const user = userEvent.setup();
    vi.mocked(netWorthApi.getNetWorthIndependence)
      .mockResolvedValueOnce(mockIndependenceData)
      .mockResolvedValueOnce(mockIndependenceData);

    renderWithProviders(<FinancialIndependencePage />);

    expect(await screen.findByTestId('net-worth-independence-cards')).toBeInTheDocument();

    const period6mBtn = screen.getByRole('button', { name: '6m' });
    await user.click(period6mBtn);

    expect(netWorthApi.getNetWorthIndependence).toHaveBeenCalledWith({
      baseCurrency: 'EUR',
      periodMonths: 6,
    });
  });
});
