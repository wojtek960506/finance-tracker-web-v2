import { api } from '@shared/api';

import type { SpendingLinkResponse, UnlinkSpendingPayload } from './types';

export const unlinkSpending = async (
  vehicleIdOrPayload: string | UnlinkSpendingPayload,
  maybePayload?: UnlinkSpendingPayload,
): Promise<SpendingLinkResponse> => {
  const payload =
    typeof vehicleIdOrPayload === 'string'
      ? (maybePayload as UnlinkSpendingPayload)
      : vehicleIdOrPayload;

  const res = await api.post<SpendingLinkResponse>('/vehicles/spendings/unlink', payload);
  return res.data;
};
