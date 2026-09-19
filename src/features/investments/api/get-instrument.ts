import { api } from '@shared/api';

import type { InvestmentInstrumentSummary } from './types';

export const getInstrument = async (id: string): Promise<InvestmentInstrumentSummary> => {
  const res = await api.get<InvestmentInstrumentSummary>(
    `/investments/instruments/${id}`,
  );
  return res.data;
};
