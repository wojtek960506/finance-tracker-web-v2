import { api } from '@shared/api';

import type { CreateInstrumentPayload, InvestmentInstrument } from './types';

export const createInstrument = async (
  payload: CreateInstrumentPayload,
): Promise<InvestmentInstrument> => {
  const res = await api.post<InvestmentInstrument>('/investments/instruments', payload);
  return res.data;
};
