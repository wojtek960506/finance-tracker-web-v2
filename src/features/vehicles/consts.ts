import type {
  GetEquipmentQuery,
  GetFuelEntriesQuery,
  GetMaintenanceQuery,
  MaintenanceSection,
  SpendingType,
  VehicleType,
} from './api/types';

export const VEHICLE_TYPES: VehicleType[] = [
  'motorcycle',
  'car',
  'public_transport',
] as const;

export const DEFAULT_VEHICLE_TYPE: VehicleType = 'car';

export const MAINTENANCE_SECTIONS: MaintenanceSection[] = [
  'own_maintenance',
  'previous_owner_services',
  'driving_licence_costs',
] as const;

export const DEFAULT_MAINTENANCE_SECTION: MaintenanceSection = 'own_maintenance';

export const SPENDING_TYPES: SpendingType[] = [
  'fuel',
  'equipment',
  'maintenance',
] as const;

export const vehiclesQueryKeys = {
  all: ['vehicles'] as const,
  list: () => ['vehicles', 'list'] as const,
  details: (vehicleId: string) => ['vehicles', 'details', vehicleId] as const,
  fuel: (vehicleId: string, query?: GetFuelEntriesQuery) =>
    ['vehicles', vehicleId, 'fuel', query] as const,
  fuelEntry: (vehicleId: string, entryId: string) =>
    ['vehicles', vehicleId, 'fuel', entryId] as const,
  equipment: (vehicleId: string, query?: GetEquipmentQuery) =>
    ['vehicles', vehicleId, 'equipment', query] as const,
  equipmentItem: (vehicleId: string, equipmentId: string) =>
    ['vehicles', vehicleId, 'equipment', equipmentId] as const,
  maintenance: (vehicleId: string, query?: GetMaintenanceQuery) =>
    ['vehicles', vehicleId, 'maintenance', query] as const,
  maintenanceItem: (vehicleId: string, maintenanceId: string) =>
    ['vehicles', vehicleId, 'maintenance', maintenanceId] as const,
};
