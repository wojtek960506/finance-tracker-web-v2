const DEFAULT_API_BASE_URL = 'http://localhost:5000';

export const resolveApiBaseUrl = (value?: string) => {
  if (value === undefined) return DEFAULT_API_BASE_URL;

  const trimmedValue = value.trim();

  if (trimmedValue === '/') return '';
  if (trimmedValue === '') return DEFAULT_API_BASE_URL;

  return trimmedValue.replace(/\/+$/, '');
};

