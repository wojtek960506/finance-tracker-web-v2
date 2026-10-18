import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as categoriesApi from '../../api/sport-categories-api';
import * as statsApi from '../../api/sport-stats-api';
import type { SportCategory, SportStatsResponse } from '../../api/types';

import { SportsLayout } from './sports-layout';

const mockCategories: SportCategory[] = [
  {
    id: 'cat-1',
    name: 'Rower',
    nameNormalized: 'rower',
    type: 'user',
    isFavorite: false,
  },
  {
    id: 'cat-2',
    name: 'Bieganie',
    nameNormalized: 'bieganie',
    type: 'user',
    isFavorite: false,
  },
];

const mockStats: SportStatsResponse = {
  totalCostPln: 100,
  totalEntries: 1,
  byCategory: [
    {
      categoryId: 'cat-1',
      categoryName: 'Rower',
      type: 'user',
      totalCostPln: 100,
      entryCount: 1,
      percentage: 100,
    },
  ],
  byYear: [],
};

const renderLayout = (initialRoute = '/sports') => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/sports"
            element={
              <SportsLayout>
                <div data-testid="layout-child">Child Content</div>
              </SportsLayout>
            }
          />
          <Route
            path="/sports/categories/:categoryId"
            element={
              <SportsLayout>
                <div data-testid="layout-child">Category Content</div>
              </SportsLayout>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('SportsLayout', () => {
  it('renders header, tabs, and children content with filtered categories', async () => {
    vi.spyOn(categoriesApi, 'getSportCategories').mockResolvedValue(mockCategories);
    vi.spyOn(statsApi, 'getSportStats').mockResolvedValue(mockStats);

    renderLayout();

    expect(screen.getByTestId('sports-header')).toBeInTheDocument();
    expect(await screen.findByTestId('sports-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('layout-child')).toBeInTheDocument();

    expect(await screen.findByTestId('sports-tab-category-cat-1')).toBeInTheDocument();
    expect(screen.queryByTestId('sports-tab-category-cat-2')).not.toBeInTheDocument();
  });

  it('keeps current category tab visible even if it has 0 entries', async () => {
    vi.spyOn(categoriesApi, 'getSportCategories').mockResolvedValue(mockCategories);
    vi.spyOn(statsApi, 'getSportStats').mockResolvedValue(mockStats);

    renderLayout('/sports/categories/cat-2');

    expect(await screen.findByTestId('sports-tab-category-cat-2')).toBeInTheDocument();
    expect(await screen.findByTestId('sports-tab-category-cat-1')).toBeInTheDocument();
  });

  it('toggles mobile navigation when hamburger is clicked', async () => {
    vi.spyOn(categoriesApi, 'getSportCategories').mockResolvedValue(mockCategories);
    vi.spyOn(statsApi, 'getSportStats').mockResolvedValue(mockStats);

    renderLayout();

    const toggleBtn = await screen.findByTestId('sports-mobile-nav-toggle');
    expect(screen.queryByTestId('sports-mobile-nav')).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('sports-mobile-nav')).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId('sports-mobile-nav')).not.toBeInTheDocument();
  });
});
