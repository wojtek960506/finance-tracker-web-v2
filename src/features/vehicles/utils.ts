import type {
  GlobalVehiclesSummary,
  MaintenanceSection,
  VehicleActivityItem,
  VehicleEquipment,
  VehicleFuelEntry,
  VehicleFuelEntryEnriched,
  VehicleMaintenance,
  VehicleOverviewData,
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

export const formatCostPerKm = (
  cost: number | null | undefined,
  language = 'en',
): string => {
  if (cost === null || cost === undefined) return '-';
  return `${new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cost)} PLN/km`;
};

export const formatDate = (dateStr: string, language = 'en'): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const calculateVehicleOverviewData = (
  fuelEntries: VehicleFuelEntryEnriched[] = [],
  maintenanceEntries: VehicleMaintenance[] = [],
  equipmentEntries: VehicleEquipment[] = [],
): VehicleOverviewData => {
  const fuelTotalSpentPln = fuelEntries.reduce(
    (acc, curr) => acc + (curr.costPln || 0),
    0,
  );
  const totalFuelLiters = fuelEntries.reduce(
    (acc, curr) => acc + (curr.fuelLiters || 0),
    0,
  );

  const consumptions = fuelEntries
    .map((e) => e.consumptionLPer100Km)
    .filter((val): val is number => typeof val === 'number' && val > 0);
  const avgConsumptionLPer100Km =
    consumptions.length > 0
      ? consumptions.reduce((a, b) => a + b, 0) / consumptions.length
      : null;

  const costsPerKm = fuelEntries
    .map((e) => e.costPerKmPln)
    .filter((val): val is number => typeof val === 'number' && val > 0);
  const costPerKmPln =
    costsPerKm.length > 0
      ? costsPerKm.reduce((a, b) => a + b, 0) / costsPerKm.length
      : null;

  const maintenanceTotalSpentPln = maintenanceEntries.reduce(
    (acc, curr) => acc + (curr.costPln || 0),
    0,
  );

  const bySection: Record<MaintenanceSection, { costPln: number; count: number }> = {
    own_maintenance: { costPln: 0, count: 0 },
    previous_owner_services: { costPln: 0, count: 0 },
    driving_licence_costs: { costPln: 0, count: 0 },
  };

  for (const m of maintenanceEntries) {
    if (bySection[m.section]) {
      bySection[m.section].costPln += m.costPln || 0;
      bySection[m.section].count += 1;
    }
  }

  const equipmentTotalSpentPln = equipmentEntries.reduce(
    (acc, curr) => acc + (curr.costPln || 0),
    0,
  );

  const totalSpentPln =
    fuelTotalSpentPln + maintenanceTotalSpentPln + equipmentTotalSpentPln;

  const odometers = [
    ...fuelEntries.map((e) => e.odometerKm),
    ...maintenanceEntries
      .map((m) => m.odometerKm)
      .filter((km): km is number => typeof km === 'number'),
  ].filter((km): km is number => typeof km === 'number');

  const currentOdometerKm = odometers.length > 0 ? Math.max(...odometers) : null;
  const minOdometerKm = odometers.length > 0 ? Math.min(...odometers) : null;
  const totalDistanceKm =
    currentOdometerKm !== null &&
    minOdometerKm !== null &&
    currentOdometerKm > minOdometerKm
      ? currentOdometerKm - minOdometerKm
      : null;

  const fuelActivity: VehicleActivityItem[] = fuelEntries.map((e) => ({
    id: e.id,
    type: 'fuel',
    date: e.date,
    costPln: e.costPln,
    title: e.stationBrand || 'Refueling',
    description: e.description || e.stationAddress,
    odometerKm: e.odometerKm,
    transactionId: e.transactionId,
    fuelLiters: e.fuelLiters,
    isFullTank: e.isFullTank,
    consumptionLPer100Km: e.consumptionLPer100Km,
  }));

  const maintenanceActivity: VehicleActivityItem[] = maintenanceEntries.map((m) => ({
    id: m.id,
    type: 'maintenance',
    date: m.date,
    costPln: m.costPln,
    title: m.serviceProvider || m.description || m.section,
    description: m.description,
    odometerKm: m.odometerKm,
    transactionId: m.transactionId,
    maintenanceSection: m.section,
    serviceProvider: m.serviceProvider,
  }));

  const equipmentActivity: VehicleActivityItem[] = equipmentEntries.map((eq) => ({
    id: eq.id,
    type: 'equipment',
    date: eq.date,
    costPln: eq.costPln,
    title: eq.itemName,
    description: eq.description,
    transactionId: eq.transactionId,
  }));

  const recentActivity = [
    ...fuelActivity,
    ...maintenanceActivity,
    ...equipmentActivity,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    totalSpentPln,
    fuel: {
      totalSpentPln: fuelTotalSpentPln,
      totalLiters: totalFuelLiters,
      avgConsumptionLPer100Km,
      costPerKmPln,
      entriesCount: fuelEntries.length,
    },
    maintenance: {
      totalSpentPln: maintenanceTotalSpentPln,
      entriesCount: maintenanceEntries.length,
      bySection,
    },
    equipment: {
      totalSpentPln: equipmentTotalSpentPln,
      entriesCount: equipmentEntries.length,
    },
    stats: {
      currentOdometerKm,
      minOdometerKm,
      totalDistanceKm,
      refuelingCount: fuelEntries.length,
      maintenanceCount: maintenanceEntries.length,
      equipmentCount: equipmentEntries.length,
    },
    recentActivity,
  };
};
