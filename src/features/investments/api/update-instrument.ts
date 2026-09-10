import { api } from '@shared/api';

import type { InvestmentInstrument, UpdateInstrumentPayload } from './types';

export const updateInstrument = async (
  id: string,
  payload: UpdateInstrumentPayload,
): Promise<InvestmentInstrument> => {
  const res = await api.patch<InvestmentInstrument>(
    `/investments/instruments/${id}`,
    payload,
  );
  return res.data;
};
