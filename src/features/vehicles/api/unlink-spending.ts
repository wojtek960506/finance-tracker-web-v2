import { api } from '@shared/api';

import type { SpendingLinkResponse, UnlinkSpendingPayload } from './types';

export const unlinkSpending = async (
  vehicleId: string,
  payload: UnlinkSpendingPayload,
): Promise<SpendingLinkResponse> => {
  const res = await api.post<SpendingLinkResponse>(
    `/vehicles/${vehicleId}/spendings/unlink`,
    payload,
  );
  return res.data;
};
