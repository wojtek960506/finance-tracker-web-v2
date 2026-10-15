import { describe, expect, it, vi } from 'vitest';

import { api } from '@shared/api';

import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicleOverview,
  getVehicles,
  getVehiclesSummary,
  updateVehicle,
  type Vehicle,
  type VehicleOverviewResponse,
  type VehiclesSummaryResponse,
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

  it('getVehiclesSummary fetches global and per-vehicle spending summary', async () => {
    const mockSummary: VehiclesSummaryResponse = {
      summary: {
        totalVehicles: 1,
        totalSpentPln: 1500,
        totalFuelSpentPln: 800,
        totalMaintenanceSpentPln: 500,
        totalEquipmentSpentPln: 200,
        totalFuelEntriesCount: 5,
        totalMaintenanceCount: 2,
        totalEquipmentCount: 1,
        totalDistanceKm: 1200,
      },
      vehicles: [
        {
          ...mockVehicle,
          spending: {
            fuelTotalPln: 800,
            maintenanceTotalPln: 500,
            equipmentTotalPln: 200,
            totalSpentPln: 1500,
            lastOdometerKm: 151200,
            totalDistanceKm: 1200,
            fuelEntriesCount: 5,
            maintenanceCount: 2,
            equipmentCount: 1,
          },
        },
      ],
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockSummary });

    const result = await getVehiclesSummary();

    expect(api.get).toHaveBeenCalledWith('/vehicles/summary');
    expect(result).toEqual(mockSummary);
  });

  it('getVehicleOverview fetches vehicle overview data with optional query params', async () => {
    const mockOverview: VehicleOverviewResponse = {
      vehicleId: 'veh-1',
      totalSpentPln: 1500,
      stats: {
        currentOdometerKm: 151200,
        minOdometerKm: 150000,
        totalDistanceKm: 1200,
        refuelingCount: 5,
        maintenanceCount: 2,
        equipmentCount: 1,
      },
      fuel: {
        totalSpentPln: 800,
        totalLiters: 150,
        avgConsumptionLPer100Km: 5.5,
        costPerKmPln: 0.67,
        entriesCount: 5,
      },
      maintenance: {
        totalSpentPln: 500,
        entriesCount: 2,
      },
      equipment: {
        totalSpentPln: 200,
        entriesCount: 1,
      },
      recentActivity: [
        {
          id: 'act-1',
          type: 'fuel',
          date: '2026-03-01T10:00:00Z',
          costPln: 150,
          title: 'Orlen',
          odometerKm: 151200,
        },
      ],
    };

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockOverview });

    const result = await getVehicleOverview('veh-1', { activityLimit: 10 });

    expect(api.get).toHaveBeenCalledWith('/vehicles/veh-1/overview', {
      params: { activityLimit: 10 },
    });
    expect(result).toEqual(mockOverview);
  });
});
