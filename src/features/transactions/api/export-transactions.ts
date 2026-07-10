import { buildTransactionFiltersSearchParams } from '@transactions/utils/transactions-query';

import type { TransactionFilters } from './types';

import { api } from '@/shared/api';

export const DEFAULT_EXPORT_FILENAME = 'transactions-export.csv';

export type ExportTransactionsResult = {
  csv: Blob;
};

export const exportTransactions = async (
  filters: TransactionFilters = {},
): Promise<ExportTransactionsResult> => {
  const params = buildTransactionFiltersSearchParams(filters);
  const query = params.toString();
  const url = query ? `/transactions/export?${query}` : '/transactions/export';

  const res = await api.get<Blob>(url, { responseType: 'blob' });

  return {
    csv: res.data,
  };
};
