import { useQuery } from '@tanstack/react-query';

import {
  getVehiclesSummary,
  type GlobalVehiclesSummary,
  type VehiclesSummaryResponse,
  type VehicleWithSpending,
} from '../api';
import { vehiclesQueryKeys } from '../consts';

const defaultSummary: GlobalVehiclesSummary = {
  totalVehicles: 0,
  totalSpentPln: 0,
  totalFuelSpentPln: 0,
  totalMaintenanceSpentPln: 0,
  totalEquipmentSpentPln: 0,
  totalFuelEntriesCount: 0,
  totalMaintenanceCount: 0,
  totalEquipmentCount: 0,
  totalDistanceKm: 0,
};

export const useAllVehiclesSummary = () => {
  const { data, isLoading, isFetching, error, refetch } = useQuery<
    VehiclesSummaryResponse,
    Error
  >({
    queryKey: vehiclesQueryKeys.summary(),
    queryFn: getVehiclesSummary,
  });

  const vehicles: VehicleWithSpending[] = data?.vehicles ?? [];
  const summary: GlobalVehiclesSummary = data?.summary ?? defaultSummary;
  const hasVehicles = vehicles.length > 0;

  return {
    vehicles,
    summary,
    hasVehicles,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};
