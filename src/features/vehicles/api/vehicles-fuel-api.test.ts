import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  createFuelEntry,
  deleteFuelEntry,
  getFuelEntries,
  getFuelEntry,
  updateFuelEntry,
  type VehicleFuelEntry,
} from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockFuelEntry: VehicleFuelEntry = {
  id: 'fuel-1',
  ownerId: 'user-1',
  vehicleId: 'veh-1',
  date: '2026-01-01T12:00:00.000Z',
  fuelLiters: 14.5,
  isFullTank: true,
  unitPricePln: 6.45,
  costPln: 93.53,
  odometerKm: 34500,
  stationBrand: 'Orlen',
  stationAddress: 'Main St 1',
  description: 'Regular fill up',
  transactionId: null,
  createdAt: '2026-01-01T12:00:00.000Z',
  updatedAt: '2026-01-01T12:00:00.000Z',
};

describe('Vehicles Fuel API', () => {
  it('getFuelEntries fetches fuel logs with query params', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [mockFuelEntry] });

    const query = { isFullTank: true, limit: 10 };
    const result = await getFuelEntries('veh-1', query);

    expect(api.get).toHaveBeenCalledWith('/vehicles/veh-1/fuel', {
      params: query,
    });
    expect(result).toEqual([mockFuelEntry]);
  });

  it('getFuelEntry fetches single entry', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockFuelEntry });

    const result = await getFuelEntry('veh-1', 'fuel-1');

    expect(api.get).toHaveBeenCalledWith('/vehicles/veh-1/fuel/fuel-1');
    expect(result).toEqual(mockFuelEntry);
  });

  it('createFuelEntry posts new fuel log', async () => {
    const payload = {
      date: '2026-01-01T12:00:00.000Z',
      fuelLiters: 14.5,
      isFullTank: true,
      unitPricePln: 6.45,
      costPln: 93.53,
      odometerKm: 34500,
    };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockFuelEntry });

    const result = await createFuelEntry('veh-1', payload);

    expect(api.post).toHaveBeenCalledWith('/vehicles/veh-1/fuel', payload);
    expect(result).toEqual(mockFuelEntry);
  });

  it('updateFuelEntry patches fuel log', async () => {
    const payload = { unitPricePln: 6.5 };
    vi.mocked(api.patch).mockResolvedValueOnce({
      data: { ...mockFuelEntry, unitPricePln: 6.5 },
    });

    const result = await updateFuelEntry('veh-1', 'fuel-1', payload);

    expect(api.patch).toHaveBeenCalledWith('/vehicles/veh-1/fuel/fuel-1', payload);
    expect(result.unitPricePln).toBe(6.5);
  });

  it('deleteFuelEntry deletes fuel log', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

    await deleteFuelEntry('veh-1', 'fuel-1');

    expect(api.delete).toHaveBeenCalledWith('/vehicles/veh-1/fuel/fuel-1');
  });
});
