import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearAuthToken,
  resetAuthState,
  setAuthToken,
  useAuthStore,
} from './auth-store';

describe('auth-store', () => {
  beforeEach(() => {
    resetAuthState();
  });

  it('tracks resolved auth state when token is set', () => {
    setAuthToken('token-123');

    expect(useAuthStore.getState().authToken).toBe('token-123');
    expect(useAuthStore.getState().isAuthResolved).toBe(true);
  });

  it('tracks resolved auth state when token is cleared', () => {
    useAuthStore.getState().setAuthToken('token');

    clearAuthToken();

    expect(useAuthStore.getState().authToken).toBeNull();
    expect(useAuthStore.getState().isAuthResolved).toBe(true);
  });

  it('resets auth state to unresolved defaults', () => {
    setAuthToken('token-123');

    resetAuthState();

    expect(useAuthStore.getState().authToken).toBeNull();
    expect(useAuthStore.getState().isAuthResolved).toBe(false);
  });
});
