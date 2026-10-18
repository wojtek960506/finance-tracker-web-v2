import { api } from '@shared/api';

import type { SportStatsQuery, SportStatsResponse } from './types';

export const getSportStats = async (
  query?: SportStatsQuery,
): Promise<SportStatsResponse> => {
  const res = await api.get<SportStatsResponse>('/sports/stats', {
    params: query,
  });
  return res.data;
};
