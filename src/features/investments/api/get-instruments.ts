import { api } from '@shared/api';

import type { GetInstrumentsQuery, InvestmentInstrument } from './types';

export const getInstruments = async (
  query?: GetInstrumentsQuery,
): Promise<InvestmentInstrument[]> => {
  const res = await api.get<InvestmentInstrument[]>('/investments/instruments', {
    params: query,
  });
  return res.data;
};
