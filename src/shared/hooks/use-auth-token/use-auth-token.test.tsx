import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAuthToken } from './use-auth-token';

const mocks = vi.hoisted(() => ({
  authToken: { value: 'token' as string | null },
  setItem: vi.fn(),
  removeItem: vi.fn(),
}));

vi.mock('../use-local-storage', () => ({
  useLocalStorage: () => ({
    item: mocks.authToken.value,
    setItem: mocks.setItem,
    removeItem: mocks.removeItem,
  }),
}));

describe('useAuthToken', () => {
  it('exposes auth token and authentication state', () => {
    mocks.authToken.value = 'token';

    const { result } = renderHook(() => useAuthToken());

    expect(result.current.authToken).toBe('token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('marks unauthenticated when token is missing', () => {
    mocks.authToken.value = null;

    const { result } = renderHook(() => useAuthToken());

    expect(result.current.authToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('exposes setters from local storage hook', () => {
    const { result } = renderHook(() => useAuthToken());

    result.current.setAuthToken('next');
    result.current.removeAuthToken();

    expect(mocks.setItem).toHaveBeenCalledWith('next');
    expect(mocks.removeItem).toHaveBeenCalled();
  });
});
