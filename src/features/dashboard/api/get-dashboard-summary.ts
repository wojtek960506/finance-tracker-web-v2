import { api } from '@shared/api';

import type { DashboardSummaryQueryParams, DashboardSummaryResponseDTO } from './types';

export const getDashboardSummary = async (
  params?: DashboardSummaryQueryParams,
): Promise<DashboardSummaryResponseDTO> => {
  const res = await api.get<DashboardSummaryResponseDTO>('/dashboard/summary', {
    params,
  });
  return res.data;
};
