import { api } from '@shared/api';

import type { InvestmentInstrument } from './types';

export const getInstrument = async (id: string): Promise<InvestmentInstrument> => {
  const res = await api.get<InvestmentInstrument>(`/investments/instruments/${id}`);
  return res.data;
};
