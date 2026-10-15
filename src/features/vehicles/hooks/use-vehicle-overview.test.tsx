import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as vehiclesApi from '../api';

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
    it('fetches fuel, maintenance, equipment and aggregates overview data', async () => {
      vi.spyOn(vehiclesApi, 'getFuelEntries').mockResolvedValueOnce([
        {
          id: 'f-1',
          ownerId: 'u-1',
          vehicleId: 'v-1',
          date: '2026-02-01T10:00:00Z',
          fuelLiters: 45,
          isFullTank: true,
          unitPricePln: 6.5,
          costPln: 292.5,
          odometerKm: 100500,
          consumptionLPer100Km: 7.2,
          costPerKmPln: 0.47,
          distanceSincePreviousKm: 625,
          distanceSincePreviousFullKm: 625,
          fuelLitersToFull: 45,
          costToFullPln: 292.5,
          kmPerLiter: 13.89,
          createdAt: '',
          updatedAt: '',
        },
      ]);

      vi.spyOn(vehiclesApi, 'getMaintenance').mockResolvedValueOnce([
        {
          id: 'm-1',
          ownerId: 'u-1',
          vehicleId: 'v-1',
          section: 'ownMaintenance',
          date: '2026-02-10T11:00:00Z',
          costPln: 350,
          odometerKm: 100800,
          serviceProvider: 'Garage A',
          createdAt: '',
          updatedAt: '',
        },
      ]);

      vi.spyOn(vehiclesApi, 'getEquipment').mockResolvedValueOnce([
        {
          id: 'e-1',
          ownerId: 'u-1',
          vehicleId: 'v-1',
          itemName: 'First Aid Kit',
          costPln: 50,
          date: '2026-02-15T12:00:00Z',
          createdAt: '',
          updatedAt: '',
        },
      ]);

      const { result } = renderHook(() => useVehicleOverview('v-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

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
      vi.spyOn(vehiclesApi, 'getFuelEntries').mockResolvedValueOnce([]);

      const { result } = renderHook(() => useFuelEntries('v-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(vehiclesApi.getFuelEntries).toHaveBeenCalledWith('v-1', undefined);
    });
  });

  describe('useMaintenance', () => {
    it('fetches maintenance records for vehicle', async () => {
      vi.spyOn(vehiclesApi, 'getMaintenance').mockResolvedValueOnce([]);

      const { result } = renderHook(() => useMaintenance('v-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(vehiclesApi.getMaintenance).toHaveBeenCalledWith('v-1', undefined);
    });
  });

  describe('useEquipment', () => {
    it('fetches equipment items for vehicle', async () => {
      vi.spyOn(vehiclesApi, 'getEquipment').mockResolvedValueOnce([]);

      const { result } = renderHook(() => useEquipment('v-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(vehiclesApi.getEquipment).toHaveBeenCalledWith('v-1', undefined);
    });
  });
});
