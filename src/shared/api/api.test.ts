import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AUTH_TOKEN_STORE_KEY,
  BASE_URL,
  LOCAL_STORAGE_CHANGE_EVENT,
} from '@shared/consts';
import { readLocalStorage } from '@shared/utils';

const mocks = vi.hoisted(() => {
  let requestHandler: ((config: any) => any) | undefined;
  let responseSuccessHandler: ((response: any) => any) | undefined;
  let responseErrorHandler: ((error: any) => any) | undefined;

  const apiInstance = Object.assign(vi.fn(), {
    interceptors: {
      request: {
        use: (handler: (config: any) => any) => {
          requestHandler = handler;
        },
      },
      response: {
        use: (success: (response: any) => any, error: (err: any) => any) => {
          responseSuccessHandler = success;
          responseErrorHandler = error;
        },
      },
    },
  });

  return {
    apiInstance,
    axiosCreate: vi.fn(() => apiInstance),
    axiosGet: vi.fn(),
    axiosIsAxiosError: vi.fn((error: unknown) =>
      Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
    ),
    getRequestHandler: () => requestHandler,
    getResponseSuccessHandler: () => responseSuccessHandler,
    getResponseErrorHandler: () => responseErrorHandler,
  };
});

vi.mock('axios', () => ({
  default: {
    create: mocks.axiosCreate,
    get: mocks.axiosGet,
    isAxiosError: mocks.axiosIsAxiosError,
  },
}));

vi.mock('@shared/utils', () => ({
  readLocalStorage: vi.fn(),
}));

import { api } from './api';

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('creates the api instance with base URL and credentials', async () => {
    vi.mocked(axios.create).mockClear();
    vi.resetModules();

    const { api: freshApi } = await import('./api');

    expect(vi.mocked(axios.create)).toHaveBeenCalledWith({
      baseURL: `${BASE_URL}/api`,
      withCredentials: true,
    });
    expect(freshApi).toBe(mocks.apiInstance);
    expect(api).toBe(mocks.apiInstance);
  });

  it('returns responses unchanged in the success interceptor', () => {
    const successHandler = mocks.getResponseSuccessHandler();
    expect(successHandler).toBeTypeOf('function');

    const response = { data: { ok: true } };
    expect(successHandler!(response)).toBe(response);
  });

  it('adds authorization header when a token exists', () => {
    const requestHandler = mocks.getRequestHandler();
    expect(requestHandler).toBeTypeOf('function');

    vi.mocked(readLocalStorage).mockReturnValue('token-123');

    const config = { headers: {} };
    const result = requestHandler!(config);

    expect(result.headers.Authorization).toBe('Bearer token-123');
  });

  it('does not add authorization header when token is missing', () => {
    const requestHandler = mocks.getRequestHandler();
    expect(requestHandler).toBeTypeOf('function');

    vi.mocked(readLocalStorage).mockReturnValue(null);

    const config = { headers: {} };
    const result = requestHandler!(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('refreshes token on 401 and retries the original request', async () => {
    const responseErrorHandler = mocks.getResponseErrorHandler();
    expect(responseErrorHandler).toBeTypeOf('function');

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    vi.mocked(mocks.axiosGet).mockResolvedValue({
      data: { accessToken: 'new-token' },
    });
    mocks.apiInstance.mockResolvedValueOnce('retried');

    const error = {
      isAxiosError: true,
      response: { status: 401 },
      config: { headers: {}, _retry: false },
    };

    const result = await responseErrorHandler!(error);

    expect(mocks.axiosGet).toHaveBeenCalledWith(`${BASE_URL}/api/auth/refresh`, {
      withCredentials: true,
    });
    expect(window.localStorage.getItem(AUTH_TOKEN_STORE_KEY)).toBe(
      JSON.stringify('new-token'),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: LOCAL_STORAGE_CHANGE_EVENT,
        detail: { key: AUTH_TOKEN_STORE_KEY },
      }),
    );
    expect((error.config.headers as { Authorization: string }).Authorization).toBe(
      'Bearer new-token',
    );
    expect(mocks.apiInstance).toHaveBeenCalledWith(error.config);
    expect(result).toBe('retried');
  });

  it('clears token when refresh fails', async () => {
    const responseErrorHandler = mocks.getResponseErrorHandler();
    expect(responseErrorHandler).toBeTypeOf('function');

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    vi.mocked(mocks.axiosGet).mockRejectedValue(new Error('refresh failed'));
    window.localStorage.setItem(AUTH_TOKEN_STORE_KEY, JSON.stringify('old-token'));

    const error = {
      isAxiosError: true,
      response: { status: 401 },
      config: { headers: {}, _retry: false },
    };

    await expect(responseErrorHandler!(error)).rejects.toMatchObject({
      name: 'ApiError',
      statusCode: 401,
    });

    expect(mocks.axiosGet).toHaveBeenCalled();
    expect(window.localStorage.getItem(AUTH_TOKEN_STORE_KEY)).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: LOCAL_STORAGE_CHANGE_EVENT,
        detail: { key: AUTH_TOKEN_STORE_KEY },
      }),
    );
  });

  it('rejects normalized errors for non-401 errors or already retried requests', async () => {
    const responseErrorHandler = mocks.getResponseErrorHandler();
    expect(responseErrorHandler).toBeTypeOf('function');

    const error = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          details: { field: 'name' },
        },
      },
      config: { headers: {}, _retry: false },
    };
    const retriedError = {
      isAxiosError: true,
      response: { status: 401 },
      config: { headers: {}, _retry: true },
    };

    await expect(responseErrorHandler!(error)).rejects.toMatchObject({
      message: 'Unexpected server error.',
      statusCode: 500,
      details: { field: 'name' },
    });
    await expect(responseErrorHandler!(retriedError)).rejects.toMatchObject({
      message: 'Unexpected server error.',
      statusCode: 401,
    });

    expect(mocks.axiosGet).not.toHaveBeenCalled();
  });
});
