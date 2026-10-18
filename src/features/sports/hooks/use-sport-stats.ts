import { useQuery } from '@tanstack/react-query';

import {
  getSportStats,
  sportsQueryKeys,
  type SportStatsQuery,
  type SportStatsResponse,
} from '../api';

export const useSportStats = (query?: SportStatsQuery) => {
  return useQuery<SportStatsResponse, Error>({
    queryKey: sportsQueryKeys.stats(query),
    queryFn: () => getSportStats(query),
  });
};
