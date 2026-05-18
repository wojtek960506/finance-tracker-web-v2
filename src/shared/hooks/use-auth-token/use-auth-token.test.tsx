import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAuthToken } from './use-auth-token';

const mocks = vi.hoisted(() => ({
  authToken: { value: 'token' as string | null },
  isAuthResolved: { value: true },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  ensureAuthResolved: vi.fn().mockResolvedValue('token'),
}));

vi.mock('@shared/store/auth-store', () => ({
  useAuthStore: () => ({
    authToken: mocks.authToken.value,
    isAuthResolved: mocks.isAuthResolved.value,
    clearAuthToken: mocks.clearAuthToken,
  }),
  ensureAuthResolved: mocks.ensureAuthResolved,
  setAuthToken: mocks.setAuthToken,
}));

describe('useAuthToken', () => {
  it('exposes auth token, resolved state, and authentication state', () => {
    mocks.authToken.value = 'token';
    mocks.isAuthResolved.value = true;

    const { result } = renderHook(() => useAuthToken());

    expect(result.current.authToken).toBe('token');
    expect(result.current.isAuthResolved).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('exposes auth token and authentication state', () => {
    mocks.authToken.value = null;
    mocks.isAuthResolved.value = true;

    const { result } = renderHook(() => useAuthToken());

    expect(result.current.authToken).toBeNull();
    expect(result.current.isAuthResolved).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('exposes setters from auth store', () => {
    mocks.isAuthResolved.value = true;

    const { result } = renderHook(() => useAuthToken());

    result.current.setAuthToken('next');
    result.current.removeAuthToken();

    expect(mocks.setAuthToken).toHaveBeenCalledWith('next');
    expect(mocks.clearAuthToken).toHaveBeenCalled();
  });

  it('restores auth session when auth is not resolved yet', async () => {
    mocks.authToken.value = null;
    mocks.isAuthResolved.value = false;

    renderHook(() => useAuthToken());

    await waitFor(() => {
      expect(mocks.ensureAuthResolved).toHaveBeenCalled();
    });
  });
});
