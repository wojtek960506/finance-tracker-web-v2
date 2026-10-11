import { describe, expect, it } from 'vitest';

import type {
  VehicleEquipment,
  VehicleFuelEntry,
  VehicleMaintenance,
  VehicleWithSpending,
} from './types';
import {
  calculateGlobalSummary,
  calculateVehicleSpending,
  formatConsumption,
  formatKm,
  formatLiters,
  formatPln,
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

    it('formats consumption', () => {
      expect(formatConsumption(6.543, 'en')).toBe('6.54 L/100km');
      expect(formatConsumption(null)).toBe('-');
    });
  });
});
