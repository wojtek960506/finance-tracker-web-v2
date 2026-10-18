import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { SportCategory, SportStatsCategory } from '../../api';

import { SportCategoryHeader } from './sport-category-header';

const mockSystemCategory: SportCategory = {
  id: 'cat-sys-1',
  name: 'Gym',
  type: 'system',
  isFavorite: false,
};

const mockCustomCategory: SportCategory = {
  id: 'cat-usr-1',
  name: 'Bouldering',
  type: 'user',
  isFavorite: true,
};

const mockStats: SportStatsCategory = {
  categoryId: 'cat-usr-1',
  categoryName: 'Bouldering',
  type: 'user',
  totalCostPln: 800,
  entryCount: 6,
  percentage: 35,
};

describe('SportCategoryHeader', () => {
  it('renders system category with system badge', () => {
    render(<SportCategoryHeader category={mockSystemCategory} />);

    expect(screen.getByTestId('sport-category-header')).toBeInTheDocument();
    expect(screen.getByText('Gym')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.queryByTestId('category-favorite-star')).not.toBeInTheDocument();
  });

  it('renders custom category with custom badge, favorite star, and spending share', () => {
    render(
      <SportCategoryHeader
        category={mockCustomCategory}
        categoryStats={mockStats}
        colorIndex={2}
      />,
    );

    expect(screen.getByText('Bouldering')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByTestId('category-favorite-star')).toBeInTheDocument();
    expect(screen.getByText('Spending share: 35%')).toBeInTheDocument();
  });

  it('renders Add Activity button and triggers onAddActivity when clicked', () => {
    const handleAddActivity = vi.fn();

    render(
      <SportCategoryHeader
        category={mockCustomCategory}
        onAddActivity={handleAddActivity}
      />,
    );

    const addButton = screen.getByTestId('category-add-activity-button');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(handleAddActivity).toHaveBeenCalledTimes(1);
  });

  it('renders loading skeleton when isLoading is true or category is missing', () => {
    render(<SportCategoryHeader isLoading={true} />);

    expect(screen.getByTestId('sport-category-header-loading')).toBeInTheDocument();
    expect(screen.queryByText('Gym')).not.toBeInTheDocument();
  });
});
