import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { Vehicle } from '@vehicles/api';
import * as vehiclesApi from '@vehicles/api';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { DeleteVehicleModal } from './delete-vehicle-modal';

vi.mock('@vehicles/api', async () => {
  const actual = await vi.importActual('@vehicles/api');
  return {
    ...actual,
    deleteVehicle: vi.fn(),
  };
});

const mockVehicleToDelete: Vehicle = {
  id: 'veh-del-1',
  name: 'Old Honda Civic',
  slug: 'old-honda-civic',
  type: 'car',
  ownerId: 'user-1',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('DeleteVehicleModal', () => {
  it('calls deleteVehicle on confirm and closes modal', async () => {
    vi.mocked(vehiclesApi.deleteVehicle).mockResolvedValue();
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <DeleteVehicleModal
        vehicle={mockVehicleToDelete}
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    );

    const deleteBtn = screen.getByRole('button', {
      name: /delete vehicle/i,
    });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(vehiclesApi.deleteVehicle).toHaveBeenCalledWith('veh-del-1');
    });

    expect(onClose).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });
});
