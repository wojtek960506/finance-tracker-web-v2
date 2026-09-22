import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import type { NetWorthResponseDTO } from '@features/net-worth/api';
import * as netWorthApi from '@features/net-worth/api';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { useNetWorth } from './use-net-worth';

const mockNetWorthData: NetWorthResponseDTO = {
  baseCurrency: 'PLN',
  netWorth: {
    total: 150000,
    liquidCash: 55000,
    investments: 95000,
  },
  byCurrency: {
    USD: {
      currency: 'USD',
      cash: 5000,
      investments: 10000,
      total: 15000,
      normalizedTotal: 60000,
    },
    PLN: {
      currency: 'PLN',
      cash: 35000,
      investments: 55000,
      total: 90000,
      normalizedTotal: 90000,
    },
  },
  allocation: {
    share: {
      category: 'share',
      amount: 40000,
      percentage: 26.67,
    },
    cash: {
      category: 'cash',
      amount: 55000,
      percentage: 36.67,
    },
  },
};

vi.mock('@features/net-worth/api', async () => {
  const actual = await vi.importActual('@features/net-worth/api');
  return {
    ...actual,
    getNetWorth: vi.fn(),
  };
});

describe('useNetWorth', () => {
  it('loads net worth data and derives sorted currencies and allocations', async () => {
    vi.mocked(netWorthApi.getNetWorth).mockResolvedValueOnce(mockNetWorthData);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useNetWorth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.baseCurrency).toBe('PLN');
    expect(result.current.totals).toEqual(mockNetWorthData.netWorth);
    expect(result.current.currencies).toEqual(['PLN', 'USD']);
    expect(result.current.byCurrencyList[0]?.currency).toBe('PLN');
    expect(result.current.byCurrencyList[1]?.currency).toBe('USD');
    // Sorted by percentage descending
    expect(result.current.allocationList[0]?.category).toBe('cash');
    expect(result.current.allocationList[1]?.category).toBe('share');
    expect(result.current.hasData).toBe(true);
  });

  it('allows changing base currency and refetches', async () => {
    vi.mocked(netWorthApi.getNetWorth)
      .mockResolvedValueOnce(mockNetWorthData)
      .mockResolvedValueOnce({
        ...mockNetWorthData,
        baseCurrency: 'EUR',
      });

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useNetWorth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setBaseCurrency('EUR');
    });

    await waitFor(() => {
      expect(result.current.baseCurrency).toBe('EUR');
    });
  });

  it('filters out zero-value currencies and empty allocation items', async () => {
    const dataWithZeros: NetWorthResponseDTO = {
      baseCurrency: 'PLN',
      netWorth: {
        total: 50000,
        liquidCash: 50000,
        investments: 0,
      },
      byCurrency: {
        PLN: {
          currency: 'PLN',
          cash: 50000,
          investments: 0,
          total: 50000,
          normalizedTotal: 50000,
        },
        USD: {
          currency: 'USD',
          cash: 0,
          investments: 0,
          total: 0,
          normalizedTotal: 0,
        },
      },
      allocation: {
        cash: {
          category: 'cash',
          amount: 50000,
          percentage: 100,
        },
        share: {
          category: 'share',
          amount: 0,
          percentage: 0,
        },
      },
    };

    vi.mocked(netWorthApi.getNetWorth).mockResolvedValueOnce(dataWithZeros);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useNetWorth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.currencies).toEqual(['PLN']);
    expect(result.current.byCurrencyList).toHaveLength(1);
    expect(result.current.byCurrencyList[0]?.currency).toBe('PLN');
    expect(result.current.allocationList).toHaveLength(1);
    expect(result.current.allocationList[0]?.category).toBe('cash');
  });
});
