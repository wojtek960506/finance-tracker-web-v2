import { normalizeApiError } from '@shared/api/api-error';

export const isNotFoundTransactionQueryError = (error: unknown) =>
  normalizeApiError(error).statusCode === 404;
