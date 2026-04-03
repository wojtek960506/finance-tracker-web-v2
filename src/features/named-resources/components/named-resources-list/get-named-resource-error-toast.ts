import type { ApiError } from '@shared/api/api-error';

type TranslateError = (key: string, options?: Record<string, string>) => string;

const isAlreadyExistsErrorCode = (code?: string) =>
  typeof code === 'string' && code.endsWith('_ALREADY_EXISTS');

export const getNamedResourceErrorToast = ({
  apiError,
  fallbackTitle,
  resourceName,
  tError,
}: {
  apiError: ApiError;
  fallbackTitle: string;
  resourceName: string;
  tError: TranslateError;
}) => {
  if (!apiError.code) {
    return {
      title: fallbackTitle,
      message: apiError.message,
    };
  }

  const translatedError = tError(apiError.code, { resourceName });

  if (isAlreadyExistsErrorCode(apiError.code)) {
    return {
      title: translatedError,
    };
  }

  return {
    title: fallbackTitle,
    message: translatedError,
  };
};
