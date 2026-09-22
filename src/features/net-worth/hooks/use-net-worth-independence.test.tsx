import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { DEFAULT_BASE_CURRENCY, useSettingsStore } from '@store/settings-store';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import type { NetWorthIndependenceResponseDTO } from '../api';
import * as netWorthApi from '../api';

import { useNetWorthIndependence } from './use-net-worth-independence';

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

vi.mock('../api', async () => {
  const actual = await vi.importActual('../api');
  return {
    ...actual,
    getNetWorthIndependence: vi.fn(),
  };
});

describe('useNetWorthIndependence', () => {
  beforeEach(() => {
    useSettingsStore.setState({ baseCurrency: DEFAULT_BASE_CURRENCY });
  });

  it('fetches independence data with default 12 periodMonths and baseCurrency', async () => {
    vi.mocked(netWorthApi.getNetWorthIndependence).mockResolvedValueOnce(
      mockIndependenceData,
    );

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useNetWorthIndependence({ baseCurrency: 'PLN' }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(netWorthApi.getNetWorthIndependence).toHaveBeenCalledWith({
      baseCurrency: 'PLN',
      periodMonths: 12,
    });
    expect(result.current.data).toEqual(mockIndependenceData);
    expect(result.current.independence?.netWorthMonths).toBe(42.04);
    expect(result.current.isPerpetual).toBe(false);
    expect(result.current.hasData).toBe(true);
  });

  it('allows updating periodMonths to trigger refetch with new period', async () => {
    vi.mocked(netWorthApi.getNetWorthIndependence).mockResolvedValue(
      mockIndependenceData,
    );

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () =>
        useNetWorthIndependence({
          baseCurrency: 'PLN',
          initialPeriodMonths: 6,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(netWorthApi.getNetWorthIndependence).toHaveBeenCalledWith({
      baseCurrency: 'PLN',
      periodMonths: 6,
    });

    act(() => {
      result.current.setPeriodMonths(24);
    });

    await waitFor(() => {
      expect(netWorthApi.getNetWorthIndependence).toHaveBeenCalledWith({
        baseCurrency: 'PLN',
        periodMonths: 24,
      });
    });
  });

  it('reads baseCurrency from settings store or options', async () => {
    useSettingsStore.setState({ baseCurrency: 'EUR' });
    vi.mocked(netWorthApi.getNetWorthIndependence).mockResolvedValue(
      mockIndependenceData,
    );

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useNetWorthIndependence(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.baseCurrency).toBe('EUR');
    expect(netWorthApi.getNetWorthIndependence).toHaveBeenCalledWith({
      baseCurrency: 'EUR',
      periodMonths: 12,
    });
  });
});
