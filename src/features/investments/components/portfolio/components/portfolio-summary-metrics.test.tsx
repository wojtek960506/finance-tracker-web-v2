import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { InvestmentCurrencySummary } from '@features/investments/api';
import { renderWithProviders } from '@test-utils';

import { PortfolioSummaryMetrics } from './portfolio-summary-metrics';

const mockCurrencySummary: InvestmentCurrencySummary = {
  currency: 'USD',
  totalCurrentValue: 12500,
  totalNetInvested: 9500,
  totalBought: 10000,
  totalSold: 500,
  totalInterest: 150,
  totalFees: 25,
  totalPnL: 3000,
  roiPercentage: 31.58,
  instrumentsCount: 3,
};

describe('PortfolioSummaryMetrics', () => {
  it('renders all metrics correctly', () => {
    renderWithProviders(<PortfolioSummaryMetrics summary={mockCurrencySummary} />);

    expect(screen.getByText('Total Portfolio Value')).toBeInTheDocument();
    expect(screen.getByText(/12.*500.*USD/i)).toBeInTheDocument();

    expect(screen.getByText('Net Invested')).toBeInTheDocument();
    expect(screen.getByText(/9.*500.*USD/i)).toBeInTheDocument();

    expect(screen.getByText('Total Return / Profit (PnL)')).toBeInTheDocument();
    expect(screen.getByText(/3.*000.*USD/i)).toBeInTheDocument();
    expect(screen.getByText(/\+31\.58% ROI/i)).toBeInTheDocument();

    expect(screen.getByText('Active Instruments')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Total Bought')).toBeInTheDocument();
    expect(screen.getByText(/^10,000\.00 USD$/i)).toBeInTheDocument();
    expect(screen.getByText('Total Sold')).toBeInTheDocument();
    expect(screen.getByText(/^500\.00 USD$/i)).toBeInTheDocument();
    expect(screen.getByText('Total Interest')).toBeInTheDocument();
    expect(screen.getByText(/^150\.00 USD$/i)).toBeInTheDocument();
    expect(screen.getByText('Total Fees')).toBeInTheDocument();
    expect(screen.getByText(/^25\.00 USD$/i)).toBeInTheDocument();
  });
});
