import '@shared/i18n';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { SportStatsCategory } from '../../api/types';

import { SportsCategoryBreakdown } from './sports-category-breakdown';

const mockCategories: SportStatsCategory[] = [
  {
    categoryId: 'cat-1',
    categoryName: 'Kolarstwo',
    type: 'user',
    totalCostPln: 2500,
    entryCount: 15,
    percentage: 71.42,
  },
  {
    categoryId: 'cat-2',
    categoryName: 'Inne',
    categoryKey: 'other',
    type: 'system',
    totalCostPln: 1000,
    entryCount: 5,
    percentage: 28.58,
  },
];

describe('SportsCategoryBreakdown', () => {
  it('renders category rows with navigation links', () => {
    render(
      <MemoryRouter>
        <SportsCategoryBreakdown categories={mockCategories} totalCostPln={3500} />
      </MemoryRouter>,
    );

    const row1 = screen.getByTestId('category-breakdown-row-cat-1');
    const row2 = screen.getByTestId('category-breakdown-row-cat-2');

    expect(row1).toBeInTheDocument();
    expect(row2).toBeInTheDocument();
    expect(row1).toHaveAttribute('href', '/sports/categories/cat-1');
    expect(row2).toHaveAttribute('href', '/sports/categories/cat-2');

    expect(screen.getByText('Kolarstwo')).toBeInTheDocument();
    expect(screen.getByText('2,500.00 PLN')).toBeInTheDocument();
    expect(screen.getByText('71.42%')).toBeInTheDocument();
  });

  it('returns null when category list is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <SportsCategoryBreakdown categories={[]} totalCostPln={0} />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('translates system otherCategory with categoryKey othercategory', () => {
    const categories: SportStatsCategory[] = [
      {
        categoryId: 'cat-system-other',
        categoryName: 'otherCategory',
        categoryKey: 'othercategory',
        type: 'system',
        totalCostPln: 500,
        entryCount: 2,
        percentage: 100,
      },
    ];

    render(
      <MemoryRouter>
        <SportsCategoryBreakdown categories={categories} totalCostPln={500} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Other category')).toBeInTheDocument();
  });
});
