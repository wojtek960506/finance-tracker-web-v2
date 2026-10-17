import '@shared/i18n';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SportStatsResponse } from '../../api/types';

import { SportsStatsCards } from './sports-stats-cards';

const mockStats: SportStatsResponse = {
  totalCostPln: 3500.5,
  totalEntries: 24,
  byCategory: [
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
      totalCostPln: 1000.5,
      entryCount: 9,
      percentage: 28.58,
    },
  ],
  byYear: [{ year: 2026, totalCostPln: 3500.5, entryCount: 24 }],
  byMonth: [
    { year: 2026, month: 1, totalCostPln: 1500, entryCount: 10 },
    { year: 2026, month: 2, totalCostPln: 2000.5, entryCount: 14 },
  ],
};

describe('SportsStatsCards', () => {
  it('renders all 4 stat cards with formatted values', () => {
    render(<SportsStatsCards stats={mockStats} />);

    expect(screen.getByTestId('stats-card-total-spent')).toBeInTheDocument();
    expect(screen.getByTestId('stats-card-total-entries')).toBeInTheDocument();
    expect(screen.getByTestId('stats-card-top-category')).toBeInTheDocument();
    expect(screen.getByTestId('stats-card-monthly-avg')).toBeInTheDocument();

    expect(screen.getByText('3,500.50 PLN')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Kolarstwo')).toBeInTheDocument();
  });

  it('handles empty categories gracefully', () => {
    const emptyStats: SportStatsResponse = {
      totalCostPln: 0,
      totalEntries: 0,
      byCategory: [],
      byYear: [],
    };

    render(<SportsStatsCards stats={emptyStats} />);

    expect(screen.getByTestId('stats-card-top-category')).toHaveTextContent('-');
  });
});
