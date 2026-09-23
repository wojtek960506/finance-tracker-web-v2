import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { PortfolioFilters } from './portfolio-filters';

describe('PortfolioFilters', () => {
  it('renders search input, kind filters, and status pills', () => {
    renderWithProviders(
      <PortfolioFilters
        searchQuery=""
        onSearchQueryChange={vi.fn()}
        selectedStatus="all"
        onSelectStatus={vi.fn()}
        selectedKind="all"
        onSelectKind={vi.fn()}
        onResetFilters={vi.fn()}
        hasActiveFilters={false}
      />,
    );

    expect(screen.getByTestId('portfolio-filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search instruments...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^active$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^closed$/i })).toBeInTheDocument();
  });

  it('calls onSearchQueryChange when typing into search input', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    renderWithProviders(
      <PortfolioFilters
        searchQuery=""
        onSearchQueryChange={handleSearch}
        selectedStatus="all"
        onSelectStatus={vi.fn()}
        selectedKind="all"
        onSelectKind={vi.fn()}
        onResetFilters={vi.fn()}
        hasActiveFilters={false}
      />,
    );

    const input = screen.getByPlaceholderText('Search instruments...');
    await user.type(input, 'Apple');

    expect(handleSearch).toHaveBeenCalled();
  });

  it('calls onSelectStatus when clicking status pill', async () => {
    const user = userEvent.setup();
    const handleSelectStatus = vi.fn();

    renderWithProviders(
      <PortfolioFilters
        searchQuery=""
        onSearchQueryChange={vi.fn()}
        selectedStatus="all"
        onSelectStatus={handleSelectStatus}
        selectedKind="all"
        onSelectKind={vi.fn()}
        onResetFilters={vi.fn()}
        hasActiveFilters={false}
      />,
    );

    await user.click(screen.getByRole('button', { name: /^active$/i }));
    expect(handleSelectStatus).toHaveBeenCalledWith('active');
  });

  it('shows and handles reset filters when filters are active', async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();

    renderWithProviders(
      <PortfolioFilters
        searchQuery="Apple"
        onSearchQueryChange={vi.fn()}
        selectedStatus="active"
        onSelectStatus={vi.fn()}
        selectedKind="share"
        onSelectKind={vi.fn()}
        onResetFilters={handleReset}
        hasActiveFilters={true}
      />,
    );

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
