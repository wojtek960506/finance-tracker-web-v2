import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { NetWorthIndependenceResponseDTO } from '@features/net-worth/api';
import * as netWorthApi from '@features/net-worth/api';
import { renderWithProviders } from '@test-utils';

import { NetWorthIndependenceSection } from './net-worth-independence-section';

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

const mockPerpetualIndependenceData: NetWorthIndependenceResponseDTO = {
  ...mockIndependenceData,
  independence: {
    netWorthMonths: null,
    liquidCapitalMonths: null,
    liquidCashMonths: null,
    isPerpetual: true,
  },
};

vi.mock('@features/net-worth/api', async () => {
  const actual = await vi.importActual('@features/net-worth/api');
  return {
    ...actual,
    getNetWorthIndependence: vi.fn(),
  };
});

describe('NetWorthIndependenceSection', () => {
  it('renders independence metrics and breakdown correctly', async () => {
    vi.mocked(netWorthApi.getNetWorthIndependence).mockResolvedValueOnce(
      mockIndependenceData,
    );

    renderWithProviders(<NetWorthIndependenceSection baseCurrency="PLN" />);

    expect(
      await screen.findByTestId('net-worth-independence-section'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('net-worth-independence-cards')).toBeInTheDocument();
    expect(screen.getByTestId('net-worth-independence-breakdown')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Financial Independence & Safety Runway',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Wynagrodzenie / Praca')).toBeInTheDocument();
  });

  it('renders perpetual infinity symbol when isPerpetual is true', async () => {
    vi.mocked(netWorthApi.getNetWorthIndependence).mockResolvedValueOnce(
      mockPerpetualIndependenceData,
    );

    renderWithProviders(<NetWorthIndependenceSection baseCurrency="PLN" />);

    expect(
      await screen.findByTestId('net-worth-independence-section'),
    ).toBeInTheDocument();
    const infinitySymbols = screen.getAllByText('∞');
    expect(infinitySymbols.length).toBeGreaterThanOrEqual(1);
  });

  it('allows switching analysis period', async () => {
    const user = userEvent.setup();
    vi.mocked(netWorthApi.getNetWorthIndependence)
      .mockResolvedValueOnce(mockIndependenceData)
      .mockResolvedValueOnce(mockIndependenceData);

    renderWithProviders(<NetWorthIndependenceSection baseCurrency="PLN" />);

    expect(
      await screen.findByTestId('net-worth-independence-section'),
    ).toBeInTheDocument();

    const period24mBtn = screen.getByRole('button', { name: '24m' });
    await user.click(period24mBtn);

    expect(netWorthApi.getNetWorthIndependence).toHaveBeenCalledWith({
      baseCurrency: 'PLN',
      periodMonths: 24,
    });
  });
});
