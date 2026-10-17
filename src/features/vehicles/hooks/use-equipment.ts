import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import {
  getEquipment,
  type GetEquipmentQuery,
  type VehicleEquipmentWithSummaryResponse,
} from '../api';
import { DEFAULT_PAGE_LIMIT, vehiclesQueryKeys } from '../consts';

export const useEquipment = (
  vehicleId: string,
  query?: GetEquipmentQuery,
): UseInfiniteQueryResult<InfiniteData<VehicleEquipmentWithSummaryResponse>, Error> => {
  return useInfiniteQuery({
    queryKey: vehiclesQueryKeys.equipment(vehicleId, query),
    queryFn: ({ pageParam }) =>
      getEquipment(vehicleId, {
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
