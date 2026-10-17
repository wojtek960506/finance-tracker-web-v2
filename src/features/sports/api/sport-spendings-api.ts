import { api } from '@shared/api';

import type {
  LinkSportSpendingsPayload,
  SportSpendingLinkResponse,
  UnlinkSportSpendingPayload,
} from './types';

export const linkSportSpendings = async (
  payload: LinkSportSpendingsPayload,
): Promise<SportSpendingLinkResponse> => {
  const res = await api.post<SportSpendingLinkResponse>(
    '/sports/spendings/link',
    payload,
  );
  return res.data;
};

export const unlinkSportSpending = async (
  payload: UnlinkSportSpendingPayload,
): Promise<SportSpendingLinkResponse> => {
  const res = await api.post<SportSpendingLinkResponse>(
    '/sports/spendings/unlink',
    payload,
  );
  return res.data;
};
