import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  createEquipment,
  deleteEquipment,
  getEquipment,
  getEquipmentItem,
  updateEquipment,
  type VehicleEquipment,
} from './index';

vi.mock('@shared/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockEquipment: VehicleEquipment = {
  id: 'eq-1',
  ownerId: 'user-1',
  vehicleId: 'veh-1',
  date: '2026-01-02T10:00:00.000Z',
  itemName: 'Motorcycle Helmet',
  costPln: 1200,
  description: 'HJC RPHA 70',
  transactionId: null,
  createdAt: '2026-01-02T10:00:00.000Z',
  updatedAt: '2026-01-02T10:00:00.000Z',
};

describe('Vehicles Equipment API', () => {
  it('getEquipment fetches equipment items', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [mockEquipment] });

    const result = await getEquipment('veh-1');

    expect(api.get).toHaveBeenCalledWith('/vehicles/veh-1/equipment', {
      params: undefined,
    });
    expect(result).toEqual([mockEquipment]);
  });

  it('getEquipmentItem fetches single item', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockEquipment });

    const result = await getEquipmentItem('veh-1', 'eq-1');

    expect(api.get).toHaveBeenCalledWith('/vehicles/veh-1/equipment/eq-1');
    expect(result).toEqual(mockEquipment);
  });

  it('createEquipment posts equipment item', async () => {
    const payload = {
      date: '2026-01-02T10:00:00.000Z',
      itemName: 'Motorcycle Helmet',
      costPln: 1200,
    };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockEquipment });

    const result = await createEquipment('veh-1', payload);

    expect(api.post).toHaveBeenCalledWith('/vehicles/veh-1/equipment', payload);
    expect(result).toEqual(mockEquipment);
  });

  it('updateEquipment patches equipment item', async () => {
    const payload = { costPln: 1100 };
    vi.mocked(api.patch).mockResolvedValueOnce({
      data: { ...mockEquipment, costPln: 1100 },
    });

    const result = await updateEquipment('veh-1', 'eq-1', payload);

    expect(api.patch).toHaveBeenCalledWith('/vehicles/veh-1/equipment/eq-1', payload);
    expect(result.costPln).toBe(1100);
  });

  it('deleteEquipment deletes equipment item', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

    await deleteEquipment('veh-1', 'eq-1');

    expect(api.delete).toHaveBeenCalledWith('/vehicles/veh-1/equipment/eq-1');
  });
});
