import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  createMaintenance,
  deleteMaintenance,
  getMaintenance,
  getMaintenanceItem,
  updateMaintenance,
  type VehicleMaintenance,
} from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockMaintenance: VehicleMaintenance = {
  id: 'maint-1',
  ownerId: 'user-1',
  vehicleId: 'veh-1',
  section: 'ownMaintenance',
  date: '2026-01-03T09:00:00.000Z',
  costPln: 350,
  odometerKm: 35000,
  description: 'Oil and filter change',
  serviceProvider: 'Self',
  transactionId: null,
  createdAt: '2026-01-03T09:00:00.000Z',
  updatedAt: '2026-01-03T09:00:00.000Z',
};

describe('Vehicles Maintenance API', () => {
  it('getMaintenance fetches maintenance records with section filter', async () => {
    const mockEnvelope = {
      items: [mockMaintenance],
      summary: { totalCostPln: 350, totalRecords: 1 },
      pagination: { nextCursor: null, hasMore: false, total: 1 },
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockEnvelope });

    const query = { section: 'ownMaintenance' as const };
    const result = await getMaintenance('veh-1', query);

    expect(api.get).toHaveBeenCalledWith('/vehicles/veh-1/maintenance', {
      params: query,
    });
    expect(result).toEqual(mockEnvelope);
  });

  it('getMaintenanceItem fetches single record', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockMaintenance });

    const result = await getMaintenanceItem('veh-1', 'maint-1');

    expect(api.get).toHaveBeenCalledWith('/vehicles/veh-1/maintenance/maint-1');
    expect(result).toEqual(mockMaintenance);
  });

  it('createMaintenance posts maintenance record', async () => {
    const payload = {
      section: 'ownMaintenance' as const,
      date: '2026-01-03T09:00:00.000Z',
      costPln: 350,
    };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockMaintenance });

    const result = await createMaintenance('veh-1', payload);

    expect(api.post).toHaveBeenCalledWith('/vehicles/veh-1/maintenance', payload);
    expect(result).toEqual(mockMaintenance);
  });

  it('updateMaintenance patches maintenance record', async () => {
    const payload = { costPln: 380 };
    vi.mocked(api.patch).mockResolvedValueOnce({
      data: { ...mockMaintenance, costPln: 380 },
    });

    const result = await updateMaintenance('veh-1', 'maint-1', payload);

    expect(api.patch).toHaveBeenCalledWith(
      '/vehicles/veh-1/maintenance/maint-1',
      payload,
    );
    expect(result.costPln).toBe(380);
  });

  it('deleteMaintenance deletes maintenance record', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

    await deleteMaintenance('veh-1', 'maint-1');

    expect(api.delete).toHaveBeenCalledWith('/vehicles/veh-1/maintenance/maint-1');
  });
});
