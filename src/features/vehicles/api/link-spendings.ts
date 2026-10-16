import { api } from '@shared/api';

import type { LinkSpendingsToTransactionPayload, SpendingLinkResponse } from './types';

export const linkSpendings = async (
  vehicleIdOrPayload: string | LinkSpendingsToTransactionPayload,
  maybePayload?: LinkSpendingsToTransactionPayload,
): Promise<SpendingLinkResponse> => {
  const payload =
    typeof vehicleIdOrPayload === 'string'
      ? (maybePayload as LinkSpendingsToTransactionPayload)
      : vehicleIdOrPayload;

  const res = await api.post<SpendingLinkResponse>('/vehicles/spendings/link', payload);
  return res.data;
};
