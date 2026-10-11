import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getEquipment, getFuelEntries, getMaintenance, getVehicles } from '../api';
import { vehiclesQueryKeys } from '../consts';
import type { GlobalVehiclesSummary, Vehicle, VehicleWithSpending } from '../types';
import { calculateGlobalSummary, calculateVehicleSpending } from '../utils';

export const useAllVehiclesSummary = () => {
  const {
    data: vehicles = [],
    isLoading: isVehiclesLoading,
    isFetching: isVehiclesFetching,
    error: vehiclesError,
    refetch: refetchVehicles,
  } = useQuery<Vehicle[]>({
    queryKey: vehiclesQueryKeys.list(),
    queryFn: getVehicles,
  });

  const fuelQueries = useQueries({
    queries: vehicles.map((vehicle) => ({
      queryKey: vehiclesQueryKeys.fuel(vehicle.id),
      queryFn: () => getFuelEntries(vehicle.id),
      enabled: Boolean(vehicle.id),
    })),
  });

  const maintenanceQueries = useQueries({
    queries: vehicles.map((vehicle) => ({
      queryKey: vehiclesQueryKeys.maintenance(vehicle.id),
      queryFn: () => getMaintenance(vehicle.id),
      enabled: Boolean(vehicle.id),
    })),
  });

  const equipmentQueries = useQueries({
    queries: vehicles.map((vehicle) => ({
      queryKey: vehiclesQueryKeys.equipment(vehicle.id),
      queryFn: () => getEquipment(vehicle.id),
      enabled: Boolean(vehicle.id),
    })),
  });

  const isSubQueriesLoading =
    fuelQueries.some((q) => q.isLoading) ||
    maintenanceQueries.some((q) => q.isLoading) ||
    equipmentQueries.some((q) => q.isLoading);

  const isSubQueriesFetching =
    fuelQueries.some((q) => q.isFetching) ||
    maintenanceQueries.some((q) => q.isFetching) ||
    equipmentQueries.some((q) => q.isFetching);

  const vehiclesWithSpending: VehicleWithSpending[] = useMemo(() => {
    return vehicles.map((vehicle, index) => {
      const fuelEntries = fuelQueries[index]?.data ?? [];
      const maintenanceEntries = maintenanceQueries[index]?.data ?? [];
      const equipmentEntries = equipmentQueries[index]?.data ?? [];

      const spending = calculateVehicleSpending(
        fuelEntries,
        maintenanceEntries,
        equipmentEntries,
      );

      return {
        ...vehicle,
        spending,
      };
    });
  }, [vehicles, fuelQueries, maintenanceQueries, equipmentQueries]);

  const globalSummary: GlobalVehiclesSummary = useMemo(() => {
    return calculateGlobalSummary(vehiclesWithSpending);
  }, [vehiclesWithSpending]);

  const hasVehicles = vehicles.length > 0;
  const isLoading = isVehiclesLoading || (hasVehicles && isSubQueriesLoading);
  const isFetching = isVehiclesFetching || isSubQueriesFetching;
  const error = vehiclesError;

  return {
    vehicles: vehiclesWithSpending,
    summary: globalSummary,
    hasVehicles,
    isLoading,
    isFetching,
    error,
    refetch: refetchVehicles,
  };
};
