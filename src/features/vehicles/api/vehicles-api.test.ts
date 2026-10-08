import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
  type Vehicle,
} from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockVehicle: Vehicle = {
  id: 'veh-1',
  ownerId: 'user-1',
  slug: 'suzuki-sv-650',
  name: 'Suzuki SV650',
  brand: 'Suzuki',
  vehicleModel: 'SV650',
  type: 'motorcycle',
  productionYear: 2007,
  notes: 'My motorcycle',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('Vehicles CRUD API', () => {
  it('getVehicles fetches list of vehicles', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [mockVehicle] });

    const result = await getVehicles();

    expect(api.get).toHaveBeenCalledWith('/vehicles');
    expect(result).toEqual([mockVehicle]);
  });

  it('getVehicle fetches single vehicle by id or slug', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockVehicle });

    const result = await getVehicle('veh-1');

    expect(api.get).toHaveBeenCalledWith('/vehicles/veh-1');
    expect(result).toEqual(mockVehicle);
  });

  it('createVehicle posts new vehicle payload', async () => {
    const payload = {
      name: 'Suzuki SV650',
      type: 'motorcycle' as const,
    };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockVehicle });

    const result = await createVehicle(payload);

    expect(api.post).toHaveBeenCalledWith('/vehicles', payload);
    expect(result).toEqual(mockVehicle);
  });

  it('updateVehicle patches vehicle by id', async () => {
    const payload = { name: 'Suzuki SV650 ABS' };
    vi.mocked(api.patch).mockResolvedValueOnce({
      data: { ...mockVehicle, name: 'Suzuki SV650 ABS' },
    });

    const result = await updateVehicle('veh-1', payload);

    expect(api.patch).toHaveBeenCalledWith('/vehicles/veh-1', payload);
    expect(result.name).toBe('Suzuki SV650 ABS');
  });

  it('deleteVehicle deletes vehicle by id', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

    await deleteVehicle('veh-1');

    expect(api.delete).toHaveBeenCalledWith('/vehicles/veh-1');
  });
});
