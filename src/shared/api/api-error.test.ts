import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, normalizeApiError } from './api-error';

vi.mock('axios', () => ({
  default: {
    isAxiosError: vi.fn(),
  },
}));

describe('api-error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates ApiError with defaults', () => {
    const error = new ApiError();

    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('Unexpected server error.');
  });

  it('returns the same instance when error is already normalized', () => {
    const error = new ApiError({ message: 'Already normalized' });

    expect(normalizeApiError(error)).toBe(error);
  });

  it('normalizes axios errors including details', () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(true);

    const error = {
      message: 'Request failed with status code 409',
      response: {
        status: 409,
        data: {
          code: 'RESOURCE_EXISTS',
          error: 'Conflict',
          message: 'Resource already exists.',
          statusCode: 409,
          details: { field: 'name' },
        },
      },
    };

    const normalized = normalizeApiError(error);

    expect(normalized).toMatchObject({
      name: 'ApiError',
      code: 'RESOURCE_EXISTS',
      error: 'Conflict',
      message: 'Resource already exists.',
      statusCode: 409,
      details: { field: 'name' },
    });
  });

  it('falls back to generic Error message when error is not axios', () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(false);

    const normalized = normalizeApiError(new Error('Boom'));

    expect(normalized).toMatchObject({
      name: 'ApiError',
      message: 'Boom',
    });
  });

  it('falls back to the default ApiError for unknown values', () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(false);

    const normalized = normalizeApiError('boom');

    expect(normalized).toMatchObject({
      name: 'ApiError',
      message: 'Unexpected server error.',
    });
  });
});
