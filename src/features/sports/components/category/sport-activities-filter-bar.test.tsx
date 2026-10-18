import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SportActivitiesFilterBar } from './sport-activities-filter-bar';
import type { SportActivitiesFilters } from './types';

describe('SportActivitiesFilterBar', () => {
  it('renders all filter controls and default elements', () => {
    const handleFiltersChange = vi.fn();

    render(
      <SportActivitiesFilterBar filters={{}} onFiltersChange={handleFiltersChange} />,
    );

    expect(screen.getByTestId('sport-activities-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('activities-search-input')).toBeInTheDocument();
    expect(screen.getByTestId('activities-start-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('activities-end-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('activities-sort-select')).toBeInTheDocument();
    expect(
      screen.queryByTestId('activities-reset-filters-button'),
    ).not.toBeInTheDocument();
  });

  it('calls onFiltersChange when search query is typed', () => {
    const handleFiltersChange = vi.fn();

    render(
      <SportActivitiesFilterBar filters={{}} onFiltersChange={handleFiltersChange} />,
    );

    const searchInput = screen.getByTestId('activities-search-input');
    fireEvent.change(searchInput, { target: { value: 'shoes' } });

    expect(handleFiltersChange).toHaveBeenCalledWith({
      search: 'shoes',
    });
  });

  it('shows reset button when active filters exist and resets on click', () => {
    const handleFiltersChange = vi.fn();
    const activeFilters: SportActivitiesFilters = {
      search: 'climbing',
      sort: 'cost_desc',
    };

    render(
      <SportActivitiesFilterBar
        filters={activeFilters}
        onFiltersChange={handleFiltersChange}
      />,
    );

    const resetButton = screen.getByTestId('activities-reset-filters-button');
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(handleFiltersChange).toHaveBeenCalledWith({
      sort: 'date_desc',
    });
  });

  it('toggles mobile filter container visibility when toggle button is clicked', () => {
    render(<SportActivitiesFilterBar filters={{}} onFiltersChange={vi.fn()} />);

    const toggleButton = screen.getByTestId('activities-filters-toggle');
    const container = screen.getByTestId('activities-filters-container');

    expect(container).toHaveClass('hidden xl:flex');

    fireEvent.click(toggleButton);
    expect(container).toHaveClass('flex');

    fireEvent.click(toggleButton);
    expect(container).toHaveClass('hidden xl:flex');
  });

  it('renders Add Activity button and triggers onAddActivity when clicked', () => {
    const handleAddActivity = vi.fn();

    render(
      <SportActivitiesFilterBar
        filters={{}}
        onFiltersChange={vi.fn()}
        onAddActivity={handleAddActivity}
      />,
    );

    const addButton = screen.getByTestId('activities-add-button');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(handleAddActivity).toHaveBeenCalledTimes(1);
  });
});
