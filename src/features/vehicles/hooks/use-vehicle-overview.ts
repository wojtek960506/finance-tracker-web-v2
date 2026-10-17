import { useQuery } from '@tanstack/react-query';

import {
  getVehicleOverview,
  type GetVehicleOverviewQuery,
  type VehicleOverviewResponse,
} from '../api';
import { vehiclesQueryKeys } from '../consts';

export const defaultOverviewData: VehicleOverviewResponse = {
  vehicleId: '',
  totalSpentPln: 0,
  fuel: {
    totalSpentPln: 0,
    totalLiters: 0,
    avgConsumptionLPer100Km: null,
    costPerKmPln: null,
    entriesCount: 0,
  },
  maintenance: {
    totalSpentPln: 0,
    entriesCount: 0,
  },
  equipment: {
    totalSpentPln: 0,
    entriesCount: 0,
  },
  stats: {
    currentOdometerKm: null,
    minOdometerKm: null,
    totalDistanceKm: null,
    refuelingCount: 0,
    maintenanceCount: 0,
    equipmentCount: 0,
  },
  recentActivity: [],
};

export const useVehicleOverview = (
  vehicleId: string,
  query?: GetVehicleOverviewQuery,
) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    VehicleOverviewResponse,
    Error
  >({
    queryKey: vehiclesQueryKeys.overview(vehicleId, query),
    queryFn: () => getVehicleOverview(vehicleId, query),
    enabled: Boolean(vehicleId),
  });

  return {
    overviewData: data ?? defaultOverviewData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
