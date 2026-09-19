import { api } from '@shared/api';

import type { InvestmentSummaryResponse } from './types';

export const getInvestmentSummary = async (): Promise<InvestmentSummaryResponse> => {
  const res = await api.get<InvestmentSummaryResponse>('/investments/summary');
  return res.data;
};
