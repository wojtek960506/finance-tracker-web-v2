import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as categoriesApi from '../../api/sport-categories-api';
import * as entriesApi from '../../api/sport-entries-api';
import * as statsApi from '../../api/sport-stats-api';
import type {
  SportCategory,
  SportEntryListResponse,
  SportStatsResponse,
} from '../../api/types';

import { SportCategoryPage } from './sport-category-page';

const mockCategories: SportCategory[] = [
  {
    id: 'cat-1',
    name: 'Running',
    nameNormalized: 'running',
    type: 'system',
    isFavorite: true,
  },
];

const mockStats: SportStatsResponse = {
  totalCostPln: 1200,
  totalEntries: 8,
  byCategory: [
    {
      categoryId: 'cat-1',
      categoryName: 'Running',
      type: 'system',
      totalCostPln: 1200,
      entryCount: 8,
      percentage: 100,
    },
  ],
  byYear: [{ year: 2026, totalCostPln: 1200, entryCount: 8 }],
};

const mockEntriesResponse: SportEntryListResponse = {
  items: [
    {
      id: 'entry-1',
      ownerId: 'user-1',
      categoryId: 'cat-1',
      category: {
        id: 'cat-1',
        name: 'Running',
        type: 'system',
      },
      date: '2026-03-01T12:00:00Z',
      itemName: 'Running Shoes',
      costPln: 450,
      transactionId: 'tx-1',
      createdAt: '2026-03-01T12:00:00Z',
      updatedAt: '2026-03-01T12:00:00Z',
    },
    {
      id: 'entry-2',
      ownerId: 'user-1',
      categoryId: 'cat-1',
      category: {
        id: 'cat-1',
        name: 'Running',
        type: 'system',
      },
      date: '2026-03-10T12:00:00Z',
      itemName: 'Marathon Entry',
      costPln: 200,
      transactionId: null,
      createdAt: '2026-03-10T12:00:00Z',
      updatedAt: '2026-03-10T12:00:00Z',
    },
  ],
  pagination: {
    total: 2,
    page: 1,
    limit: 50,
    totalPages: 1,
  },
};

const renderCategoryPage = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/sports/categories/cat-1']}>
        <Routes>
          <Route path="/sports/categories/:categoryId" element={<SportCategoryPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('SportCategoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(categoriesApi, 'getSportCategories').mockResolvedValue(mockCategories);
    vi.spyOn(statsApi, 'getSportStats').mockResolvedValue(mockStats);
  });

  it('renders PageLoading spinner while category or entries are loading', () => {
    vi.spyOn(entriesApi, 'getSportEntries').mockReturnValue(new Promise(() => {}));

    renderCategoryPage();

    expect(screen.getByTestId('sport-category-loading')).toBeInTheDocument();
  });

  it('renders category header, summary cards, and filter bar when data is loaded', async () => {
    vi.spyOn(entriesApi, 'getSportEntries').mockResolvedValue(mockEntriesResponse);

    renderCategoryPage();

    const header = await screen.findByTestId('sport-category-header');
    expect(header).toBeInTheDocument();
    expect(within(header).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Running',
    );

    const summary = screen.getByTestId('sport-category-summary');
    expect(summary).toBeInTheDocument();
    expect(within(summary).getByText('1,200.00 PLN')).toBeInTheDocument();

    expect(screen.getByTestId('sport-activities-filter-bar')).toBeInTheDocument();
  });

  it('queries entries with filter when search query is entered', async () => {
    const entriesSpy = vi
      .spyOn(entriesApi, 'getSportEntries')
      .mockResolvedValue(mockEntriesResponse);

    renderCategoryPage();

    await screen.findByTestId('sport-activities-filter-bar');

    const searchInput = screen.getByTestId('activities-search-input');
    fireEvent.change(searchInput, { target: { value: 'Shoes' } });

    expect(entriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: 'cat-1',
        search: 'Shoes',
      }),
    );
  });

  it('renders empty filtered state message when filters match no activities', async () => {
    vi.spyOn(entriesApi, 'getSportEntries').mockResolvedValueOnce(mockEntriesResponse);

    renderCategoryPage();

    await screen.findByTestId('sport-activities-filter-bar');

    // Simulate search yielding 0 results
    vi.spyOn(entriesApi, 'getSportEntries').mockResolvedValueOnce({
      items: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
      },
    });

    const searchInput = screen.getByTestId('activities-search-input');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });

    expect(
      await screen.findByText('No activities match the selected filters.'),
    ).toBeInTheDocument();
  });

  it('renders default empty state message when category has no entries at all', async () => {
    vi.spyOn(statsApi, 'getSportStats').mockResolvedValueOnce({
      totalCostPln: 0,
      totalEntries: 0,
      byCategory: [],
      byYear: [],
    });

    vi.spyOn(entriesApi, 'getSportEntries').mockResolvedValue({
      items: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
      },
    });

    renderCategoryPage();

    expect(await screen.findByTestId('sport-category-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No sport activities recorded yet.')).toBeInTheDocument();
  });

  it('renders activities table rows when activities are returned', async () => {
    vi.spyOn(entriesApi, 'getSportEntries').mockResolvedValue(mockEntriesResponse);

    renderCategoryPage();

    expect(await screen.findByTestId('activity-row-entry-1')).toBeInTheDocument();
    expect(screen.getByTestId('activity-row-entry-2')).toBeInTheDocument();
    expect(screen.getAllByText('Running Shoes').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Marathon Entry').length).toBeGreaterThan(0);
  });

  it('triggers next page fetch when clicking load more in category page', async () => {
    const entriesSpy = vi
      .spyOn(entriesApi, 'getSportEntries')
      .mockImplementation((params) => {
        if (params?.page === 2) {
          return Promise.resolve({
            items: [
              {
                ...mockEntriesResponse.items[0],
                id: 'entry-3',
                itemName: 'Trail Shoes',
              },
            ],
            pagination: {
              total: 3,
              page: 2,
              limit: 2,
              totalPages: 2,
            },
          });
        }
        return Promise.resolve({
          ...mockEntriesResponse,
          pagination: {
            total: 3,
            page: 1,
            limit: 2,
            totalPages: 2,
          },
        });
      });

    renderCategoryPage();

    const loadMoreBtn = await screen.findByTestId(
      'sport-activities-table-load-more-button',
    );
    expect(loadMoreBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(loadMoreBtn);
    });

    expect(entriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: 'cat-1',
        page: 2,
      }),
    );
  });

  it('opens CreateSportActivityModal when header add activity button is clicked', async () => {
    renderCategoryPage();

    expect(screen.queryByTestId('create-sport-activity-modal')).not.toBeInTheDocument();

    const addBtn = await screen.findByTestId('sports-add-entry-button');
    expect(addBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(screen.getByTestId('create-sport-activity-modal')).toBeInTheDocument();
  });
});
