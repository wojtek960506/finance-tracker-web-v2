import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as categoriesApi from '../../api/sport-categories-api';
import type { SportCategory } from '../../api/types';

import { SportsLayout } from './sports-layout';

const mockCategories: SportCategory[] = [
  {
    id: 'cat-1',
    name: 'Rower',
    nameNormalized: 'rower',
    type: 'user',
    isFavorite: false,
  },
];

const renderLayout = (initialRoute = '/sports') => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <SportsLayout>
          <div data-testid="layout-child">Child Content</div>
        </SportsLayout>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('SportsLayout', () => {
  it('renders header, tabs, and children content', async () => {
    vi.spyOn(categoriesApi, 'getSportCategories').mockResolvedValueOnce(mockCategories);

    renderLayout();

    expect(screen.getByTestId('sports-header')).toBeInTheDocument();
    expect(screen.getByTestId('sports-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('layout-child')).toBeInTheDocument();
  });

  it('toggles mobile navigation when hamburger is clicked', async () => {
    vi.spyOn(categoriesApi, 'getSportCategories').mockResolvedValueOnce(mockCategories);

    renderLayout();

    const toggleBtn = screen.getByTestId('sports-mobile-nav-toggle');
    expect(screen.queryByTestId('sports-mobile-nav')).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('sports-mobile-nav')).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId('sports-mobile-nav')).not.toBeInTheDocument();
  });
});
