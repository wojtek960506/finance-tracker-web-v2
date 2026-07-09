import { buildTransactionFiltersSearchParams } from '@transactions/utils/transactions-query';

import type { TransactionFilters } from './types';

import { api } from '@/shared/api';

export const DEFAULT_EXPORT_FILENAME = 'transactions-export.csv';

const getExportFilename = (contentDisposition?: string) => {
  if (!contentDisposition) return DEFAULT_EXPORT_FILENAME;

  const utf8FilenameMatch = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (utf8FilenameMatch?.[1]) return decodeURIComponent(utf8FilenameMatch[1]);

  const filenameMatch = contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/i);
  if (filenameMatch?.[1]) return filenameMatch[1];

  return DEFAULT_EXPORT_FILENAME;
};

export type ExportTransactionsResult = {
  csv: Blob;
  fileName: string;
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
    fileName: getExportFilename(res.headers?.['content-disposition']),
  };
};
