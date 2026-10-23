import { queryOptions, useQuery } from '@tanstack/react-query';

import { getDashboardSummary } from './get-dashboard-summary';
import type { DashboardSummaryQueryParams } from './types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: (params?: DashboardSummaryQueryParams) =>
    [...dashboardKeys.all, 'summary', params ?? {}] as const,
};

export const dashboardSummaryQueryOptions = (params?: DashboardSummaryQueryParams) =>
  queryOptions({
    queryKey: dashboardKeys.summary(params),
    queryFn: () => getDashboardSummary(params),
  });

export const useDashboardSummary = (params?: DashboardSummaryQueryParams) => {
  return useQuery(dashboardSummaryQueryOptions(params));
};
