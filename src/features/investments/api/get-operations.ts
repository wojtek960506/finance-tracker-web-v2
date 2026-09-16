import { api } from '@shared/api';

import type { GetOperationsQuery, InvestmentOperation } from './types';

export const getOperations = async (
  query?: GetOperationsQuery,
): Promise<InvestmentOperation[]> => {
  const res = await api.get<InvestmentOperation[]>('/investments/operations', {
    params: query,
  });
  return res.data;
};
