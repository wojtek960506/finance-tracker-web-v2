import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as vehiclesApi from '../api';
import { DEFAULT_PAGE_LIMIT } from '../consts';

import { useEquipment } from './use-equipment';
import { useFuelEntries } from './use-fuel-entries';
import { useMaintenance } from './use-maintenance';
import { useVehicleOverview } from './use-vehicle-overview';

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Vehicle Overview Hooks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useVehicleOverview', () => {
    it('fetches overview data from getVehicleOverview endpoint', async () => {
      const mockOverviewData = {
        vehicleId: 'v-1',
        totalSpentPln: 692.5,
        fuel: {
          totalSpentPln: 292.5,
          totalLiters: 45,
          avgConsumptionLPer100Km: 7.2,
          costPerKmPln: 0.47,
          entriesCount: 1,
        },
        maintenance: {
          totalSpentPln: 350,
          entriesCount: 1,
        },
        equipment: {
          totalSpentPln: 50,
          entriesCount: 1,
        },
        stats: {
          currentOdometerKm: 100800,
          minOdometerKm: 100500,
          totalDistanceKm: 300,
          refuelingCount: 1,
          maintenanceCount: 1,
          equipmentCount: 1,
        },
        recentActivity: [
          {
            id: 'f-1',
            type: 'fuel' as const,
            date: '2026-02-01T10:00:00Z',
            costPln: 292.5,
            title: 'Refueling',
          },
          {
            id: 'm-1',
            type: 'maintenance' as const,
            date: '2026-02-10T11:00:00Z',
            costPln: 350,
            title: 'Garage A',
          },
          {
            id: 'e-1',
            type: 'equipment' as const,
            date: '2026-02-15T12:00:00Z',
            costPln: 50,
            title: 'First Aid Kit',
          },
        ],
      };

      vi.spyOn(vehiclesApi, 'getVehicleOverview').mockResolvedValueOnce(mockOverviewData);

      const { result } = renderHook(() => useVehicleOverview('v-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(vehiclesApi.getVehicleOverview).toHaveBeenCalledWith('v-1', undefined);
      expect(result.current.overviewData.totalSpentPln).toBe(692.5);
      expect(result.current.overviewData.fuel.totalSpentPln).toBe(292.5);
      expect(result.current.overviewData.fuel.avgConsumptionLPer100Km).toBe(7.2);
      expect(result.current.overviewData.maintenance.totalSpentPln).toBe(350);
      expect(result.current.overviewData.equipment.totalSpentPln).toBe(50);
      expect(result.current.overviewData.stats.currentOdometerKm).toBe(100800);
      expect(result.current.overviewData.stats.totalDistanceKm).toBe(300);
      expect(result.current.overviewData.recentActivity).toHaveLength(3);
    });
  });

  describe('useFuelEntries', () => {
    it('fetches fuel entries for vehicle', async () => {
      vi.spyOn(vehiclesApi, 'getFuelEntries').mockResolvedValueOnce({
        items: [],
        summary: {
          totalVolume: 0,
          totalCostPln: 0,
          avgConsumptionLPer100Km: null,
          avgUnitPricePln: null,
          totalCount: 0,
        },
        pagination: { nextCursor: null, hasMore: false, total: 0 },
      });

      const { result } = renderHook(() => useFuelEntries('v-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(vehiclesApi.getFuelEntries).toHaveBeenCalledWith('v-1', {
        cursor: undefined,
        limit: DEFAULT_PAGE_LIMIT,
      });
      expect(result.current.data?.pages).toHaveLength(1);
    });
  });

  describe('useMaintenance', () => {
    it('fetches maintenance records for vehicle', async () => {
      vi.spyOn(vehiclesApi, 'getMaintenance').mockResolvedValueOnce({
        items: [],
        summary: { totalCostPln: 0, totalRecords: 0 },
        pagination: { nextCursor: null, hasMore: false, total: 0 },
      });

      const { result } = renderHook(() => useMaintenance('v-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(vehiclesApi.getMaintenance).toHaveBeenCalledWith('v-1', {
        cursor: undefined,
        limit: DEFAULT_PAGE_LIMIT,
      });
      expect(result.current.data?.pages).toHaveLength(1);
    });
  });

  describe('useEquipment', () => {
    it('fetches equipment items for vehicle', async () => {
      vi.spyOn(vehiclesApi, 'getEquipment').mockResolvedValueOnce({
        items: [],
        summary: { totalCostPln: 0, totalItems: 0 },
        pagination: { nextCursor: null, hasMore: false, total: 0 },
      });

      const { result } = renderHook(() => useEquipment('v-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(vehiclesApi.getEquipment).toHaveBeenCalledWith('v-1', {
        cursor: undefined,
        limit: DEFAULT_PAGE_LIMIT,
      });
      expect(result.current.data?.pages).toHaveLength(1);
    });
  });
});
