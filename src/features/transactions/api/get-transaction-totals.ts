import { buildTransactionFiltersSearchParams } from '@transactions/utils/transactions-query';

import type { TransactionFilters, TransactionTotalsResponse } from './types';

import { api } from '@/shared/api';

export const getTransactionTotals = async (
  filters: TransactionFilters = {},
): Promise<TransactionTotalsResponse> => {
  const params = buildTransactionFiltersSearchParams(filters);
  const query = params.toString();
  const url = query ? `/transactions/totals?${query}` : '/transactions/totals';
  const res = await api.get(url);

  return res.data;
};
