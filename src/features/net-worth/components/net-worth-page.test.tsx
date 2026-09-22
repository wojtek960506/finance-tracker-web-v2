import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { NetWorthResponseDTO } from '@features/net-worth/api';
import * as netWorthApi from '@features/net-worth/api';
import { DEFAULT_BASE_CURRENCY, useSettingsStore } from '@store/settings-store';
import { renderWithProviders } from '@test-utils';

import { NetWorthPage } from './net-worth-page';

const mockEmptyNetWorth: NetWorthResponseDTO = {
  baseCurrency: 'PLN',
  netWorth: {
    total: 0,
    liquidCash: 0,
    investments: 0,
  },
  byCurrency: {},
  allocation: {},
};

const mockFullNetWorth: NetWorthResponseDTO = {
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

vi.mock('@features/net-worth/api', async () => {
  const actual = await vi.importActual('@features/net-worth/api');
  return {
    ...actual,
    getNetWorth: vi.fn(),
  };
});

describe('NetWorthPage', () => {
  beforeEach(() => {
    useSettingsStore.setState({ baseCurrency: DEFAULT_BASE_CURRENCY });
  });

  it('renders empty state when there is no net worth data and hides page header', async () => {
    vi.mocked(netWorthApi.getNetWorth).mockResolvedValueOnce(mockEmptyNetWorth);

    renderWithProviders(<NetWorthPage />);

    expect(await screen.findByTestId('net-worth-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No net worth data available')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Net Worth' })).not.toBeInTheDocument();
  });

  it('renders summary cards, allocation breakdown, and currency breakdown', async () => {
    vi.mocked(netWorthApi.getNetWorth).mockResolvedValueOnce(mockFullNetWorth);

    renderWithProviders(<NetWorthPage />);

    const summaryCards = await screen.findByTestId('net-worth-summary-cards');
    expect(summaryCards).toBeInTheDocument();
    expect(screen.getByTestId('net-worth-allocation-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('net-worth-currency-breakdown')).toBeInTheDocument();

    // Check summary metric labels
    expect(screen.getByText('Total Net Worth')).toBeInTheDocument();
    expect(screen.getAllByText('Liquid Cash').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Investments').length).toBeGreaterThan(0);
  });

  it('fetches net worth using the base currency from settings store', async () => {
    useSettingsStore.setState({ baseCurrency: 'EUR' });
    vi.mocked(netWorthApi.getNetWorth).mockResolvedValueOnce({
      ...mockFullNetWorth,
      baseCurrency: 'EUR',
    });

    renderWithProviders(<NetWorthPage />);

    expect(await screen.findByTestId('net-worth-summary-cards')).toBeInTheDocument();
    expect(netWorthApi.getNetWorth).toHaveBeenCalledWith({
      baseCurrency: 'EUR',
    });
  });
});
