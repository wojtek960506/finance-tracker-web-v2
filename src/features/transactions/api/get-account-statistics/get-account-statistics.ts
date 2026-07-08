import type { TransactionAccountStatisticsResponse } from '../types';

import { api } from '@/shared/api';

export const getAccountStatistics = async (): Promise<TransactionAccountStatisticsResponse> => {
  const res = await api.get<TransactionAccountStatisticsResponse>(
    '/transactions/statistics/accounts',
  );

  return res.data;
};
