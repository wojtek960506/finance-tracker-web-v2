import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { InvestmentSummaryResponse } from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { PortfolioPage } from './portfolio-page';

const mockEmptySummary: InvestmentSummaryResponse = {
  totalsByCurrency: {},
  instruments: [],
};

const mockFullSummary: InvestmentSummaryResponse = {
  totalsByCurrency: {
    USD: {
      currency: 'USD',
      totalCurrentValue: 12500,
      totalNetInvested: 10000,
      totalBought: 10000,
      totalSold: 0,
      totalInterest: 0,
      totalFees: 0,
      totalPnL: 2500,
      roiPercentage: 25,
      instrumentsCount: 1,
    },
    PLN: {
      currency: 'PLN',
      totalCurrentValue: 5000,
      totalNetInvested: 4500,
      totalBought: 4500,
      totalSold: 0,
      totalInterest: 100,
      totalFees: 0,
      totalPnL: 500,
      roiPercentage: 11.11,
      instrumentsCount: 1,
    },
  },
  instruments: [
    {
      id: 'inst-1',
      name: 'Apple Inc.',
      kind: 'share',
      currency: 'USD',
      currentValue: 12500,
      netInvested: 10000,
      totalBought: 10000,
      totalSold: 0,
      totalInterest: 0,
      totalFees: 0,
      pnl: 2500,
      roiPercentage: 25,
      lastSnapshotDate: '2026-02-01T00:00:00.000Z',
      operationsCount: 2,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
    },
    {
      id: 'inst-2',
      name: 'PKO Lokata',
      kind: 'termDeposit',
      currency: 'PLN',
      currentValue: 5000,
      netInvested: 4500,
      totalBought: 4500,
      totalSold: 0,
      totalInterest: 100,
      totalFees: 0,
      pnl: 500,
      roiPercentage: 11.11,
      lastSnapshotDate: null,
      operationsCount: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
    },
  ],
};

vi.mock('@features/investments/api', async () => {
  const actual = await vi.importActual('@features/investments/api');
  return {
    ...actual,
    getInvestmentSummary: vi.fn(),
  };
});

describe('PortfolioPage', () => {
  it('renders empty state when there are no holdings', async () => {
    const { getInvestmentSummary } = await import('@features/investments/api');
    vi.mocked(getInvestmentSummary).mockResolvedValueOnce(mockEmptySummary);

    renderWithProviders(<PortfolioPage />);

    expect(await screen.findByTestId('portfolio-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No investment holdings yet')).toBeInTheDocument();
  });

  it('renders summary metrics and holdings breakdown when data exists', async () => {
    const user = userEvent.setup();
    const { getInvestmentSummary } = await import('@features/investments/api');
    vi.mocked(getInvestmentSummary).mockResolvedValueOnce(mockFullSummary);

    renderWithProviders(<PortfolioPage />);

    expect(await screen.findByText('Investment Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Total Portfolio Value')).toBeInTheDocument();

    // Default currency is PLN (alphabetical first)
    expect(screen.getByText('PKO Lokata')).toBeInTheDocument();

    // Switch to USD
    const usdButton = screen.getByRole('button', { name: 'USD' });
    await user.click(usdButton);

    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
  });
});
