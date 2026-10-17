import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { Vehicle } from '@vehicles/api';
import * as vehiclesApi from '@vehicles/api';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import { CreateVehicleModal } from './create-vehicle-modal';

vi.mock('@vehicles/api', async () => {
  const actual = await vi.importActual('@vehicles/api');
  return {
    ...actual,
    createVehicle: vi.fn(),
  };
});

const mockCreatedVehicle: Vehicle = {
  id: 'veh-new-1',
  name: 'Mazda 3',
  slug: 'mazda-3',
  brand: 'Mazda',
  vehicleModel: '3',
  type: 'car',
  productionYear: 2019,
  ownerId: 'user-1',
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
};

describe('CreateVehicleModal', () => {
  it('calls createVehicle on submit and closes modal on success', async () => {
    vi.mocked(vehiclesApi.createVehicle).mockResolvedValue(mockCreatedVehicle);
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <CreateVehicleModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />,
    );

    const nameInput = screen.getByLabelText(/vehicle name/i);
    fireEvent.change(nameInput, { target: { value: 'Mazda 3' } });

    const submitBtn = screen.getByRole('button', { name: /create vehicle/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(vehiclesApi.createVehicle).toHaveBeenCalledWith({
        name: 'Mazda 3',
        type: 'car',
        slug: undefined,
        brand: undefined,
        vehicleModel: undefined,
        productionYear: undefined,
        notes: undefined,
      });
    });

    expect(onClose).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(mockCreatedVehicle);
  });
});
