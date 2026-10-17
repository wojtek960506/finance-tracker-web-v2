import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import {
  getMaintenance,
  type GetMaintenanceQuery,
  type VehicleMaintenanceWithSummaryResponse,
} from '../api';
import { DEFAULT_PAGE_LIMIT, vehiclesQueryKeys } from '../consts';

export const useMaintenance = (
  vehicleId: string,
  query?: GetMaintenanceQuery,
): UseInfiniteQueryResult<InfiniteData<VehicleMaintenanceWithSummaryResponse>, Error> => {
  return useInfiniteQuery({
    queryKey: vehiclesQueryKeys.maintenance(vehicleId, query),
    queryFn: ({ pageParam }) =>
      getMaintenance(vehicleId, {
        ...query,
        cursor: pageParam,
        limit: query?.limit ?? DEFAULT_PAGE_LIMIT,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasMore
        ? (lastPage.pagination.nextCursor ?? undefined)
        : undefined,
    enabled: Boolean(vehicleId),
  });
};
