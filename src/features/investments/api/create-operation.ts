import { api } from '@shared/api';

import type { CreateInvestmentOperationPayload, InvestmentOperation } from './types';

export const createOperation = async (
  payload: CreateInvestmentOperationPayload,
): Promise<InvestmentOperation> => {
  const res = await api.post<InvestmentOperation>('/investments/operations', payload);
  return res.data;
};
