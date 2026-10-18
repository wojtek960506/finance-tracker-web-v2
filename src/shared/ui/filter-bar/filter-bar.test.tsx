import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FilterBar } from './filter-bar';

describe('FilterBar', () => {
  const defaultProps = {
    testId: 'test-filter-bar',
    toggleTestId: 'test-toggle-button',
    containerTestId: 'test-container',
    hasActiveFilters: false,
    actionButton: <button type="button">Action</button>,
    children: <div>Filter Content</div>,
  };

  it('renders action button and filter children', () => {
    render(<FilterBar {...defaultProps} />);

    expect(screen.getByTestId('test-filter-bar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByText('Filter Content')).toBeInTheDocument();
  });

  it('toggles expansion state when toggle button is clicked', () => {
    render(<FilterBar {...defaultProps} />);

    const toggleBtn = screen.getByTestId('test-toggle-button');
    const container = screen.getByTestId('test-container');

    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    expect(container).toHaveClass('hidden xl:flex');

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    expect(container).toHaveClass('flex');

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    expect(container).toHaveClass('hidden xl:flex');
  });

  it('renders reset button when hasActiveFilters is true and handles click', () => {
    const handleReset = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        hasActiveFilters={true}
        onResetFilters={handleReset}
        resetLabel="Custom Reset"
      />,
    );

    const resetBtn = screen.getByTestId('filter-reset-button');
    expect(resetBtn).toBeInTheDocument();
    expect(resetBtn).toHaveTextContent('Custom Reset');

    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('does not render reset button when hasActiveFilters is false', () => {
    render(
      <FilterBar {...defaultProps} hasActiveFilters={false} onResetFilters={vi.fn()} />,
    );

    expect(screen.queryByTestId('filter-reset-button')).not.toBeInTheDocument();
  });

  it('renders custom filter label when specified', () => {
    render(<FilterBar {...defaultProps} filterLabel="Custom Filter Label" />);

    expect(screen.getByLabelText('Custom Filter Label')).toBeInTheDocument();
  });
});
