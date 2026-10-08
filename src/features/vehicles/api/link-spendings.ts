import { api } from '@shared/api';

import type { LinkSpendingsToTransactionPayload, SpendingLinkResponse } from './types';

export const linkSpendings = async (
  vehicleId: string,
  payload: LinkSpendingsToTransactionPayload,
): Promise<SpendingLinkResponse> => {
  const res = await api.post<SpendingLinkResponse>(
    `/vehicles/${vehicleId}/spendings/link`,
    payload,
  );
  return res.data;
};
