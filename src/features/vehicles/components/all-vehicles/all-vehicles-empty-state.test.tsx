import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { AllVehiclesEmptyState } from './all-vehicles-empty-state';

describe('AllVehiclesEmptyState', () => {
  it('renders title, description and triggers onCreateVehicle on button click', () => {
    const handleCreate = vi.fn();

    renderWithProviders(<AllVehiclesEmptyState onCreateVehicle={handleCreate} />);

    expect(screen.getByTestId('vehicles-empty-state')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleCreate).toHaveBeenCalledTimes(1);
  });
});
