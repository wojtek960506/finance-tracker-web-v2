import { api } from '@shared/api';

import type { GetInvestmentSummaryParams, InvestmentSummaryResponse } from './types';

export const getInvestmentSummary = async (
  params?: GetInvestmentSummaryParams,
): Promise<InvestmentSummaryResponse> => {
  const res = await api.get<InvestmentSummaryResponse>('/investments/summary', {
    params,
  });
  return res.data;
};
