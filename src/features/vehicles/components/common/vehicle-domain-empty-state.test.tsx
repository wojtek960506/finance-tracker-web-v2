import { fireEvent, render, screen } from '@testing-library/react';
import { Wrench } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { VehicleDomainEmptyState } from './vehicle-domain-empty-state';

describe('VehicleDomainEmptyState', () => {
  const defaultProps = {
    hasFilters: false,
    noMatchingText: 'No records match the filter.',
    icon: Wrench,
    iconColorClassName: 'bg-blue-500/10 text-blue-500',
    title: 'No maintenance records',
    description: 'Track ongoing vehicle repairs and oil changes.',
    createButtonLabel: 'Add first record',
    onCreateFirst: vi.fn(),
    testIdPrefix: 'maintenance',
  };

  it('renders normal empty state when hasFilters is false', () => {
    render(<VehicleDomainEmptyState {...defaultProps} />);

    expect(screen.getByTestId('maintenance-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No maintenance records')).toBeInTheDocument();
    expect(
      screen.getByText('Track ongoing vehicle repairs and oil changes.'),
    ).toBeInTheDocument();

    const createButton = screen.getByTestId('maintenance-empty-create-button');
    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);
    expect(defaultProps.onCreateFirst).toHaveBeenCalledTimes(1);
  });

  it('renders filtered empty state when hasFilters is true', () => {
    render(<VehicleDomainEmptyState {...defaultProps} hasFilters={true} />);

    expect(screen.getByTestId('maintenance-empty-matching-filters')).toBeInTheDocument();
    expect(screen.getByText('No records match the filter.')).toBeInTheDocument();
    expect(screen.queryByTestId('maintenance-empty-state')).not.toBeInTheDocument();
  });
});
