import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as categoriesApi from '../../api/sport-categories-api';
import * as statsApi from '../../api/sport-stats-api';
import type { SportStatsResponse } from '../../api/types';

import { SportsOverviewPage } from './sports-overview-page';

const mockStats: SportStatsResponse = {
  totalCostPln: 5000,
  totalEntries: 30,
  byCategory: [
    {
      categoryId: 'cat-1',
      categoryName: 'Rower',
      type: 'user',
      totalCostPln: 3500,
      entryCount: 20,
      percentage: 70,
    },
  ],
  byYear: [
    { year: 2025, totalCostPln: 2000, entryCount: 10 },
    { year: 2026, totalCostPln: 3000, entryCount: 20 },
  ],
};

const renderPage = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/sports']}>
        <SportsOverviewPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('SportsOverviewPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(categoriesApi, 'getSportCategories').mockResolvedValue([]);
  });

  it('renders stats cards, trend chart, and breakdown when data is loaded', async () => {
    vi.spyOn(statsApi, 'getSportStats').mockResolvedValueOnce(mockStats);

    renderPage();

    expect(await screen.findByTestId('sports-stats-cards')).toBeInTheDocument();
    expect(screen.getByTestId('sports-trend-chart')).toBeInTheDocument();
    expect(screen.getByTestId('sports-category-breakdown')).toBeInTheDocument();
    expect(screen.getByTestId('sports-year-filter')).toBeInTheDocument();
  });

  it('filters by year when year button is clicked', async () => {
    const statsSpy = vi.spyOn(statsApi, 'getSportStats').mockResolvedValue(mockStats);

    renderPage();

    await screen.findByTestId('sports-stats-cards');

    const year2025Btn = screen.getByTestId('sports-year-filter-2025');
    fireEvent.click(year2025Btn);

    expect(statsSpy).toHaveBeenCalledWith({ year: 2025 });
  });

  it('renders empty state when there are no entries', async () => {
    vi.spyOn(statsApi, 'getSportStats').mockResolvedValueOnce({
      totalCostPln: 0,
      totalEntries: 0,
      byCategory: [],
      byYear: [],
    });

    renderPage();

    expect(await screen.findByTestId('sports-overview-empty-state')).toBeInTheDocument();
  });
});
