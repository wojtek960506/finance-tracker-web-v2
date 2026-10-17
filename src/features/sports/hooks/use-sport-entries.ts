import {
  type InfiniteData,
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import {
  getSportEntries,
  type SportEntryFilterQuery,
  type SportEntryListResponse,
  sportsQueryKeys,
} from '../api';
import { DEFAULT_SPORTS_PAGE_LIMIT } from '../consts';

export const useSportEntries = (
  filters?: SportEntryFilterQuery,
): UseInfiniteQueryResult<InfiniteData<SportEntryListResponse>, Error> => {
  return useInfiniteQuery({
    queryKey: sportsQueryKeys.entryList(filters),
    queryFn: ({ pageParam }) =>
      getSportEntries({
        ...filters,
        page: pageParam,
        limit: filters?.limit ?? DEFAULT_SPORTS_PAGE_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
};
