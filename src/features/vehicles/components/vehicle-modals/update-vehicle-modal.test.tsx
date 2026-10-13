import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { Vehicle } from '@vehicles/api';
import * as vehiclesApi from '@vehicles/api';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { UpdateVehicleModal } from './update-vehicle-modal';

vi.mock('@vehicles/api', async () => {
  const actual = await vi.importActual('@vehicles/api');
  return {
    ...actual,
    updateVehicle: vi.fn(),
  };
});

const mockExistingVehicle: Vehicle = {
  id: 'veh-edit-1',
  name: 'Yamaha MT-07',
  slug: 'yamaha-mt-07',
  brand: 'Yamaha',
  vehicleModel: 'MT-07',
  type: 'motorcycle',
  productionYear: 2021,
  ownerId: 'user-1',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('UpdateVehicleModal', () => {
  it('pre-populates vehicle data and calls updateVehicle on submit', async () => {
    vi.mocked(vehiclesApi.updateVehicle).mockResolvedValue({
      ...mockExistingVehicle,
      name: 'Yamaha MT-07 Updated',
    });
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <UpdateVehicleModal
        vehicle={mockExistingVehicle}
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    );

    const nameInput = screen.getByLabelText(/vehicle name/i);
    expect(nameInput).toHaveValue('Yamaha MT-07');

    fireEvent.change(nameInput, { target: { value: 'Yamaha MT-07 Updated' } });

    const submitBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(vehiclesApi.updateVehicle).toHaveBeenCalledWith('veh-edit-1', {
        name: 'Yamaha MT-07 Updated',
        type: 'motorcycle',
        brand: 'Yamaha',
        vehicleModel: 'MT-07',
        productionYear: 2021,
        slug: 'yamaha-mt-07',
        notes: undefined,
      });
    });

    expect(onClose).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });
});
