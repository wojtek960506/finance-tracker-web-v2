import { api } from '@shared/api';

import type { InvestmentSnapshotOperation, UpdateSnapshotPayload } from './types';

export const updateSnapshotOperation = async (
  id: string,
  payload: UpdateSnapshotPayload,
): Promise<InvestmentSnapshotOperation> => {
  const res = await api.patch<InvestmentSnapshotOperation>(
    `/investments/operations/${id}`,
    payload,
  );
  return res.data;
};
