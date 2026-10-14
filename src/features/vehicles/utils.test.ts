import { describe, expect, it } from 'vitest';

import type {
  VehicleEquipment,
  VehicleFuelEntry,
  VehicleFuelEntryEnriched,
  VehicleMaintenance,
  VehicleWithSpending,
} from './types';
import {
  calculateGlobalSummary,
  calculateVehicleOverviewData,
  calculateVehicleSpending,
  formatCostPerKm,
  formatDate,
  formatDeltaKm,
  formatKm,
  formatLiters,
  formatPln,
  formatUnitPrice,
} from './utils';

describe('vehicles utils', () => {
  describe('calculateVehicleSpending', () => {
    it('calculates totals and max odometer correctly with entries', () => {
      const fuel: VehicleFuelEntry[] = [
        {
          id: 'f1',
          ownerId: 'u1',
          vehicleId: 'v1',
          date: '2026-01-01',
          fuelLiters: 40,
          isFullTank: true,
          unitPricePln: 6.5,
          costPln: 260,
          odometerKm: 150000,
          createdAt: '',
          updatedAt: '',
        },
        {
          id: 'f2',
          ownerId: 'u1',
          vehicleId: 'v1',
          date: '2026-01-15',
          fuelLiters: 35,
          isFullTank: true,
          unitPricePln: 6.6,
          costPln: 231,
          odometerKm: 150500,
          createdAt: '',
          updatedAt: '',
        },
      ];

      const maintenance: VehicleMaintenance[] = [
        {
          id: 'm1',
          ownerId: 'u1',
          vehicleId: 'v1',
          section: 'own_maintenance',
          date: '2026-01-10',
          costPln: 500,
          odometerKm: 150300,
          createdAt: '',
          updatedAt: '',
        },
      ];

      const equipment: VehicleEquipment[] = [
        {
          id: 'e1',
          ownerId: 'u1',
          vehicleId: 'v1',
          itemName: 'Floor mats',
          costPln: 150,
          date: '2026-01-05',
          createdAt: '',
          updatedAt: '',
        },
      ];

      const spending = calculateVehicleSpending(fuel, maintenance, equipment);

      expect(spending.fuelTotalPln).toBe(491);
      expect(spending.maintenanceTotalPln).toBe(500);
      expect(spending.equipmentTotalPln).toBe(150);
      expect(spending.totalSpentPln).toBe(1141);
      expect(spending.lastOdometerKm).toBe(150500);
      expect(spending.fuelEntriesCount).toBe(2);
      expect(spending.maintenanceCount).toBe(1);
      expect(spending.equipmentCount).toBe(1);
    });

    it('handles empty entries gracefully', () => {
      const spending = calculateVehicleSpending([], [], []);

      expect(spending.fuelTotalPln).toBe(0);
      expect(spending.maintenanceTotalPln).toBe(0);
      expect(spending.equipmentTotalPln).toBe(0);
      expect(spending.totalSpentPln).toBe(0);
      expect(spending.lastOdometerKm).toBeNull();
      expect(spending.fuelEntriesCount).toBe(0);
      expect(spending.maintenanceCount).toBe(0);
      expect(spending.equipmentCount).toBe(0);
    });
  });

  describe('calculateGlobalSummary', () => {
    it('aggregates multiple vehicles spending correctly', () => {
      const vehicles: VehicleWithSpending[] = [
        {
          id: 'v1',
          ownerId: 'u1',
          name: 'Car 1',
          slug: 'car-1',
          type: 'car',
          createdAt: '',
          updatedAt: '',
          spending: {
            fuelTotalPln: 300,
            maintenanceTotalPln: 200,
            equipmentTotalPln: 100,
            totalSpentPln: 600,
            lastOdometerKm: 100000,
            fuelEntriesCount: 2,
            maintenanceCount: 1,
            equipmentCount: 1,
          },
        },
        {
          id: 'v2',
          ownerId: 'u1',
          name: 'Moto 1',
          slug: 'moto-1',
          type: 'motorcycle',
          createdAt: '',
          updatedAt: '',
          spending: {
            fuelTotalPln: 150,
            maintenanceTotalPln: 50,
            equipmentTotalPln: 250,
            totalSpentPln: 450,
            lastOdometerKm: 25000,
            fuelEntriesCount: 3,
            maintenanceCount: 1,
            equipmentCount: 2,
          },
        },
      ];

      const global = calculateGlobalSummary(vehicles);

      expect(global.totalVehicles).toBe(2);
      expect(global.totalSpentPln).toBe(1050);
      expect(global.totalFuelSpentPln).toBe(450);
      expect(global.totalMaintenanceSpentPln).toBe(250);
      expect(global.totalEquipmentSpentPln).toBe(350);
    });
  });

  describe('formatters', () => {
    it('formats PLN currency amounts', () => {
      expect(formatPln(1234.5, 'en')).toBe('1,234.50 PLN');
    });

    it('formats km values', () => {
      expect(formatKm(150000, 'en')).toBe('150,000 km');
      expect(formatKm(null)).toBe('-');
      expect(formatKm(undefined)).toBe('-');
    });

    it('formats liters', () => {
      expect(formatLiters(45.678, 'en')).toBe('45.68 L');
    });

    it('formats cost per km', () => {
      expect(formatCostPerKm(0.456, 'en')).toBe('0.46 PLN/km');
      expect(formatCostPerKm(null)).toBe('-');
    });

    it('formats dates', () => {
      expect(formatDate('2026-05-15T12:00:00Z', 'en')).toBe('May 15, 2026');
      expect(formatDate('')).toBe('-');
    });

    it('formats unit price', () => {
      expect(formatUnitPrice(6.456, 'en')).toBe('6.46 PLN/L');
      expect(formatUnitPrice(null)).toBe('-');
    });

    it('formats delta km', () => {
      expect(formatDeltaKm(650, 'en')).toBe('+650 km');
      expect(formatDeltaKm(null)).toBe('-');
    });
  });

  describe('calculateVehicleOverviewData', () => {
    it('aggregates fuel, maintenance, equipment and recent activity', () => {
      const fuel = [
        {
          id: 'f1',
          ownerId: 'u1',
          vehicleId: 'v1',
          date: '2026-03-01T10:00:00Z',
          fuelLiters: 50,
          isFullTank: true,
          unitPricePln: 6.0,
          costPln: 300,
          odometerKm: 120000,
          stationBrand: 'Shell',
          stationAddress: 'Main St 1',
          consumptionLPer100Km: 7.5,
          costPerKmPln: 0.45,
          distanceSincePreviousKm: 600,
          distanceSincePreviousFullKm: 600,
          fuelLitersToFull: 50,
          costToFullPln: 300,
          kmPerLiter: 13.33,
          createdAt: '',
          updatedAt: '',
        },
      ];

      const maintenance = [
        {
          id: 'm1',
          ownerId: 'u1',
          vehicleId: 'v1',
          section: 'own_maintenance' as const,
          date: '2026-03-05T12:00:00Z',
          costPln: 450,
          odometerKm: 120200,
          serviceProvider: 'Brake Specialist',
          description: 'Replaced front pads',
          createdAt: '',
          updatedAt: '',
        },
      ];

      const equipment = [
        {
          id: 'e1',
          ownerId: 'u1',
          vehicleId: 'v1',
          itemName: 'Phone mount',
          costPln: 100,
          date: '2026-03-10T15:00:00Z',
          description: 'Magnetic mount',
          createdAt: '',
          updatedAt: '',
        },
      ];

      const result = calculateVehicleOverviewData(fuel, maintenance, equipment);

      expect(result.totalSpentPln).toBe(850);
      expect(result.fuel.totalSpentPln).toBe(300);
      expect(result.fuel.totalLiters).toBe(50);
      expect(result.fuel.avgConsumptionLPer100Km).toBe(7.5);
      expect(result.fuel.costPerKmPln).toBe(0.45);
      expect(result.fuel.entriesCount).toBe(1);

      expect(result.maintenance.totalSpentPln).toBe(450);
      expect(result.maintenance.entriesCount).toBe(1);
      expect(result.maintenance.bySection.own_maintenance.costPln).toBe(450);
      expect(result.maintenance.bySection.own_maintenance.count).toBe(1);
      expect(result.maintenance.bySection.previous_owner_services.costPln).toBe(0);

      expect(result.equipment.totalSpentPln).toBe(100);
      expect(result.equipment.entriesCount).toBe(1);

      expect(result.stats.currentOdometerKm).toBe(120200);
      expect(result.stats.minOdometerKm).toBe(120000);
      expect(result.stats.totalDistanceKm).toBe(200);
      expect(result.stats.refuelingCount).toBe(1);
      expect(result.stats.maintenanceCount).toBe(1);
      expect(result.stats.equipmentCount).toBe(1);

      expect(result.recentActivity).toHaveLength(3);
      // Newest date first: e1 (March 10), m1 (March 5), f1 (March 1)
      expect(result.recentActivity[0]?.id).toBe('e1');
      expect(result.recentActivity[0]?.type).toBe('equipment');
      expect(result.recentActivity[1]?.id).toBe('m1');
      expect(result.recentActivity[1]?.type).toBe('maintenance');
      expect(result.recentActivity[2]?.id).toBe('f1');
      expect(result.recentActivity[2]?.type).toBe('fuel');
    });

    it('handles empty entries safely', () => {
      const result = calculateVehicleOverviewData([], [], []);
      expect(result.totalSpentPln).toBe(0);
      expect(result.fuel.avgConsumptionLPer100Km).toBeNull();
      expect(result.fuel.costPerKmPln).toBeNull();
      expect(result.stats.currentOdometerKm).toBeNull();
      expect(result.stats.totalDistanceKm).toBeNull();
      expect(result.recentActivity).toEqual([]);
    });

    it('excludes previous_owner_services from financial totals and odometer calculations', () => {
      const fuel: VehicleFuelEntryEnriched[] = [
        {
          id: 'f1',
          ownerId: 'u1',
          vehicleId: 'v1',
          date: '2026-03-01T10:00:00Z',
          fuelLiters: 40,
          isFullTank: true,
          unitPricePln: 6.0,
          costPln: 240,
          odometerKm: 150000,
          consumptionLPer100Km: 8.0,
          costPerKmPln: 0.48,
          distanceSincePreviousKm: null,
          distanceSincePreviousFullKm: null,
          fuelLitersToFull: null,
          costToFullPln: null,
          kmPerLiter: null,
          createdAt: '',
          updatedAt: '',
        },
      ];

      const maintenance = [
        {
          id: 'm-own',
          ownerId: 'u1',
          vehicleId: 'v1',
          section: 'own_maintenance' as const,
          date: '2026-03-05T12:00:00Z',
          costPln: 300,
          odometerKm: 150500,
          description: 'Oil service',
          createdAt: '',
          updatedAt: '',
        },
        {
          id: 'm-prev',
          ownerId: 'u1',
          vehicleId: 'v1',
          section: 'previous_owner_services' as const,
          date: '2025-01-01T10:00:00Z',
          costPln: 5000,
          odometerKm: 999999,
          description: 'Historical service',
          createdAt: '',
          updatedAt: '',
        },
      ];

      const overview = calculateVehicleOverviewData(fuel, maintenance, []);
      expect(overview.totalSpentPln).toBe(540);
      expect(overview.maintenance.totalSpentPln).toBe(300);
      expect(overview.maintenance.bySection.own_maintenance.costPln).toBe(300);
      expect(overview.maintenance.bySection.previous_owner_services.costPln).toBe(5000);
      expect(overview.stats.currentOdometerKm).toBe(150500);

      const spending = calculateVehicleSpending(fuel, maintenance, []);
      expect(spending.maintenanceTotalPln).toBe(300);
      expect(spending.totalSpentPln).toBe(540);
      expect(spending.lastOdometerKm).toBe(150500);
    });
  });
});
