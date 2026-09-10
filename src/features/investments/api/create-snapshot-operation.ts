import { api } from '@shared/api';

import type { CreateSnapshotPayload, InvestmentSnapshotOperation } from './types';

export const createSnapshotOperation = async (
  payload: CreateSnapshotPayload,
): Promise<InvestmentSnapshotOperation> => {
  const res = await api.post<InvestmentSnapshotOperation>(
    '/investments/operations',
    payload,
  );
  return res.data;
};
