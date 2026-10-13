import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getEquipment, getFuelEntries, getMaintenance } from '../api';
import { vehiclesQueryKeys } from '../consts';
import type { VehicleOverviewData } from '../types';
import { calculateVehicleOverviewData } from '../utils';

export const useVehicleOverview = (vehicleId: string) => {
  const fuelQuery = useQuery({
    queryKey: vehiclesQueryKeys.fuel(vehicleId),
    queryFn: () => getFuelEntries(vehicleId),
    enabled: Boolean(vehicleId),
  });

  const maintenanceQuery = useQuery({
    queryKey: vehiclesQueryKeys.maintenance(vehicleId),
    queryFn: () => getMaintenance(vehicleId),
    enabled: Boolean(vehicleId),
  });

  const equipmentQuery = useQuery({
    queryKey: vehiclesQueryKeys.equipment(vehicleId),
    queryFn: () => getEquipment(vehicleId),
    enabled: Boolean(vehicleId),
  });

  const isLoading =
    fuelQuery.isLoading || maintenanceQuery.isLoading || equipmentQuery.isLoading;
  const isFetching =
    fuelQuery.isFetching || maintenanceQuery.isFetching || equipmentQuery.isFetching;
  const isError = fuelQuery.isError || maintenanceQuery.isError || equipmentQuery.isError;
  const error = fuelQuery.error || maintenanceQuery.error || equipmentQuery.error;

  const overviewData: VehicleOverviewData = useMemo(() => {
    return calculateVehicleOverviewData(
      fuelQuery.data ?? [],
      maintenanceQuery.data ?? [],
      equipmentQuery.data ?? [],
    );
  }, [fuelQuery.data, maintenanceQuery.data, equipmentQuery.data]);

  const refetch = async () => {
    await Promise.all([
      fuelQuery.refetch(),
      maintenanceQuery.refetch(),
      equipmentQuery.refetch(),
    ]);
  };

  return {
    overviewData,
    fuelEntries: fuelQuery.data ?? [],
    maintenanceEntries: maintenanceQuery.data ?? [],
    equipmentEntries: equipmentQuery.data ?? [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
