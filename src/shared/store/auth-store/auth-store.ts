import axios from 'axios';
import { create } from 'zustand';

import { BASE_URL } from '@shared/consts';

type AuthState = {
  authToken: string | null;
  isAuthResolved: boolean;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
  resetAuthState: () => void;
};

const defaultAuthState = {
  authToken: null,
  isAuthResolved: false,
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...defaultAuthState,
  setAuthToken: (authToken: string) => set({ authToken, isAuthResolved: true }),
  clearAuthToken: () => set({ authToken: null, isAuthResolved: true }),
  resetAuthState: () => set(defaultAuthState),
}));

let refreshPromise: Promise<string | null> | null = null;
let authSessionVersion = 0;

const setAuthenticatedToken = (token: string) => {
  useAuthStore.getState().setAuthToken(token);
};

export const getAuthToken = () => useAuthStore.getState().authToken;

export const setAuthToken = (token: string) => {
  setAuthenticatedToken(token);
};

export const clearAuthToken = () => {
  authSessionVersion += 1;
  useAuthStore.getState().clearAuthToken();
};

export const resetAuthState = () => {
  authSessionVersion += 1;
  useAuthStore.getState().resetAuthState();
};

export const refreshAuthToken = async () => {
  if (refreshPromise) return refreshPromise;

  const requestSessionVersion = authSessionVersion;
  refreshPromise = (async () => {
    try {
      const res = await axios.get<{ accessToken: string }>(
        `${BASE_URL}/api/auth/refresh`,
        { withCredentials: true },
      );

      if (requestSessionVersion !== authSessionVersion) {
        return null;
      }

      const newToken = res.data.accessToken;
      setAuthenticatedToken(newToken);
      return newToken;
    } catch {
      if (requestSessionVersion === authSessionVersion) {
        useAuthStore.getState().clearAuthToken();
      }

      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const ensureAuthResolved = async () => {
  const { isAuthResolved, authToken } = useAuthStore.getState();

  if (isAuthResolved) return authToken;

  return await refreshAuthToken();
};
