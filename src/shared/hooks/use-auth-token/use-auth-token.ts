import { useEffect } from 'react';

import {
  ensureAuthResolved,
  setAuthToken,
  useAuthStore,
} from '@shared/store/auth-store';

export const useAuthToken = () => {
  const { authToken, isAuthResolved, clearAuthToken } = useAuthStore();

  useEffect(() => {
    if (isAuthResolved) return;

    void ensureAuthResolved();
  }, [isAuthResolved]);

  return {
    authToken,
    isAuthResolved,
    setAuthToken,
    removeAuthToken: clearAuthToken,
    isAuthenticated: !!authToken,
  };
};
