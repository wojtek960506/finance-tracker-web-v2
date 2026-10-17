import '@shared/i18n';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VehicleFilterBar } from './vehicle-filter-bar';

describe('VehicleFilterBar', () => {
  const defaultProps = {
    testId: 'test-filter-bar',
    toggleTestId: 'test-toggle-button',
    hasActiveFilters: false,
    actionButton: <button type="button">Action</button>,
    children: <div>Filter Content</div>,
  };

  it('renders action button and filter children', () => {
    render(<VehicleFilterBar {...defaultProps} />);

    expect(screen.getByTestId('test-filter-bar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByText('Filter Content')).toBeInTheDocument();
  });

  it('toggles expansion state when toggle button is clicked', () => {
    render(<VehicleFilterBar {...defaultProps} />);

    const toggleBtn = screen.getByTestId('test-toggle-button');
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders reset button when hasActiveFilters is true and handles click', () => {
    const handleReset = vi.fn();
    render(
      <VehicleFilterBar
        {...defaultProps}
        hasActiveFilters={true}
        onResetFilters={handleReset}
      />,
    );

    const resetBtn = screen.getByTestId('filter-reset-button');
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('does not render reset button when hasActiveFilters is false', () => {
    render(
      <VehicleFilterBar
        {...defaultProps}
        hasActiveFilters={false}
        onResetFilters={vi.fn()}
      />,
    );

    expect(screen.queryByTestId('filter-reset-button')).not.toBeInTheDocument();
  });
});
