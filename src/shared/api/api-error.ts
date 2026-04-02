import axios from 'axios';

export type ApiErrorResponse = {
  code?: string;
  error?: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
};

export class ApiError extends Error {
  code?: string;
  error?: string;
  statusCode?: number;
  details?: unknown;

  constructor({
    code,
    error,
    message = 'Unexpected server error.',
    statusCode,
    details,
  }: ApiErrorResponse = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.error = error;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const normalizeApiError = (error: unknown) => {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return new ApiError({
      code: error.response?.data?.code,
      error: error.response?.data?.error,
      message: error.response?.data?.message ?? error.message,
      statusCode: error.response?.data?.statusCode ?? error.response?.status,
      details: error.response?.data?.details,
    });
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message });
  }

  return new ApiError();
};
