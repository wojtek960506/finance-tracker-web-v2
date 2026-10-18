import '@shared/i18n';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SportStatsResponse } from '../../api/types';

import { SportsTrendChart } from './sports-trend-chart';

const mockStats: SportStatsResponse = {
  totalCostPln: 3000,
  totalEntries: 20,
  byCategory: [],
  byYear: [
    { year: 2024, totalCostPln: 1000, entryCount: 5 },
    { year: 2025, totalCostPln: 2000, entryCount: 15 },
  ],
  byMonth: [
    { year: 2025, month: 1, totalCostPln: 500, entryCount: 3 },
    { year: 2025, month: 2, totalCostPln: 1500, entryCount: 12 },
  ],
};

describe('SportsTrendChart', () => {
  it('renders yearly trend bars when no year is selected', () => {
    render(<SportsTrendChart stats={mockStats} />);

    expect(screen.getByTestId('sports-trend-chart')).toBeInTheDocument();
    expect(screen.getByTestId('trend-bar-y-2024')).toBeInTheDocument();
    expect(screen.getByTestId('trend-bar-y-2025')).toBeInTheDocument();
  });

  it('renders monthly trend bars when year is selected', () => {
    render(<SportsTrendChart stats={mockStats} selectedYear={2025} />);

    expect(screen.getByTestId('sports-trend-chart')).toBeInTheDocument();
    expect(screen.getByTestId('trend-bar-m-1')).toBeInTheDocument();
    expect(screen.getByTestId('trend-bar-m-2')).toBeInTheDocument();
  });

  it('returns null when there are no trend data', () => {
    const emptyStats: SportStatsResponse = {
      totalCostPln: 0,
      totalEntries: 0,
      byCategory: [],
      byYear: [],
    };

    const { container } = render(<SportsTrendChart stats={emptyStats} />);
    expect(container.firstChild).toBeNull();
  });
});
