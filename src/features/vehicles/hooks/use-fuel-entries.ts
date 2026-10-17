import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import {
  getFuelEntries,
  type GetFuelEntriesQuery,
  type VehicleFuelWithSummaryResponse,
} from '../api';
import { DEFAULT_PAGE_LIMIT, vehiclesQueryKeys } from '../consts';

export const useFuelEntries = (
  vehicleId: string,
  query?: GetFuelEntriesQuery,
): UseInfiniteQueryResult<InfiniteData<VehicleFuelWithSummaryResponse>, Error> => {
  return useInfiniteQuery({
    queryKey: vehiclesQueryKeys.fuel(vehicleId, query),
    queryFn: ({ pageParam }) =>
      getFuelEntries(vehicleId, {
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
