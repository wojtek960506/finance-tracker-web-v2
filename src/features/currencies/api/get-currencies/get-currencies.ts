import { api } from '@shared/api';

import type { Currency } from './types';

export const getCurrencies = async (): Promise<Currency[]> => {
  const res = await api.get<Currency[]>('/currencies');
  return res.data;
};
