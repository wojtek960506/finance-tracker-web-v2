import type {
  GlobalVehiclesSummary,
  VehicleEquipment,
  VehicleFuelEntry,
  VehicleMaintenance,
  VehicleSpendingSummary,
  VehicleWithSpending,
} from './types';

export const calculateVehicleSpending = (
  fuelEntries: VehicleFuelEntry[] = [],
  maintenanceEntries: VehicleMaintenance[] = [],
  equipmentEntries: VehicleEquipment[] = [],
): VehicleSpendingSummary => {
  const fuelTotalPln = fuelEntries.reduce((acc, curr) => acc + (curr.costPln || 0), 0);
  const maintenanceTotalPln = maintenanceEntries.reduce(
    (acc, curr) => acc + (curr.costPln || 0),
    0,
  );
  const equipmentTotalPln = equipmentEntries.reduce(
    (acc, curr) => acc + (curr.costPln || 0),
    0,
  );

  const totalSpentPln = fuelTotalPln + maintenanceTotalPln + equipmentTotalPln;

  const odometers = [
    ...fuelEntries.map((e) => e.odometerKm),
    ...maintenanceEntries
      .map((m) => m.odometerKm)
      .filter((km): km is number => typeof km === 'number'),
  ];

  const lastOdometerKm = odometers.length > 0 ? Math.max(...odometers) : null;

  return {
    fuelTotalPln,
    maintenanceTotalPln,
    equipmentTotalPln,
    totalSpentPln,
    lastOdometerKm,
    fuelEntriesCount: fuelEntries.length,
    maintenanceCount: maintenanceEntries.length,
    equipmentCount: equipmentEntries.length,
  };
};

export const calculateGlobalSummary = (
  vehiclesWithSpending: VehicleWithSpending[] = [],
): GlobalVehiclesSummary => {
  return vehiclesWithSpending.reduce<GlobalVehiclesSummary>(
    (acc, vehicle) => ({
      totalVehicles: acc.totalVehicles + 1,
      totalSpentPln: acc.totalSpentPln + vehicle.spending.totalSpentPln,
      totalFuelSpentPln: acc.totalFuelSpentPln + vehicle.spending.fuelTotalPln,
      totalMaintenanceSpentPln:
        acc.totalMaintenanceSpentPln + vehicle.spending.maintenanceTotalPln,
      totalEquipmentSpentPln:
        acc.totalEquipmentSpentPln + vehicle.spending.equipmentTotalPln,
    }),
    {
      totalVehicles: 0,
      totalSpentPln: 0,
      totalFuelSpentPln: 0,
      totalMaintenanceSpentPln: 0,
      totalEquipmentSpentPln: 0,
    },
  );
};

export const formatPln = (amount: number, language = 'en'): string => {
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} PLN`;
};

export const formatKm = (km: number | null | undefined, language = 'en'): string => {
  if (km === null || km === undefined) return '-';
  return `${new Intl.NumberFormat(language, {
    maximumFractionDigits: 0,
  }).format(km)} km`;
};

export const formatLiters = (liters: number, language = 'en'): string => {
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(liters)} L`;
};

export const formatConsumption = (
  consumption: number | null | undefined,
  language = 'en',
): string => {
  if (consumption === null || consumption === undefined) return '-';
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(consumption)} L/100km`;
};
