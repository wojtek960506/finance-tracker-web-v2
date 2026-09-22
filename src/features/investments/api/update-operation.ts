import { api } from '@shared/api';

import type { InvestmentOperation, UpdateInvestmentOperationPayload } from './types';

export const updateOperation = async (
  id: string,
  payload: UpdateInvestmentOperationPayload,
): Promise<InvestmentOperation> => {
  const res = await api.patch<InvestmentOperation>(
    `/investments/operations/${id}`,
    payload,
  );
  return res.data;
};
