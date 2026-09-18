import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { InvestmentSummaryResponse } from '@features/investments/api';
import * as investmentsApi from '@features/investments/api';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { usePortfolio } from './use-portfolio';

const mockSummary: InvestmentSummaryResponse = {
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

describe('usePortfolio', () => {
  it('loads portfolio summary and groups by currency', async () => {
    vi.mocked(investmentsApi.getInvestmentSummary).mockResolvedValueOnce(mockSummary);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePortfolio(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.currencies).toEqual(['PLN', 'USD']);
    expect(result.current.activeCurrency).toBe('PLN');
    expect(result.current.currentCurrencySummary?.currency).toBe('PLN');
    expect(result.current.instruments).toHaveLength(1);
    expect(result.current.instruments[0]?.id).toBe('inst-2');
    expect(result.current.hasHoldings).toBe(true);
  });
});
