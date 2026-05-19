import axios from 'axios';
import { create } from 'zustand';

import { AUTH_SESSION_EVENT_KEY, BASE_URL } from '@shared/consts';

type AuthState = {
  authToken: string | null;
  isAuthResolved: boolean;
  setAuthTokenState: (token: string) => void;
  clearAuthTokenState: () => void;
  resetAuthStateState: () => void;
};

const defaultAuthState = {
  authToken: null,
  isAuthResolved: false,
};

export const useAuthStore = create<AuthState>()((set) => ({
  ...defaultAuthState,
  setAuthTokenState: (authToken: string) => set({ authToken, isAuthResolved: true }),
  clearAuthTokenState: () => set({ authToken: null, isAuthResolved: true }),
  resetAuthStateState: () => set(defaultAuthState),
}));

let refreshPromise: Promise<string | null> | null = null;
let authSessionVersion = 0;
let authBroadcastChannel: BroadcastChannel | null = null;
let authSessionSubscriberCount = 0;

// TODO: Add a backend session guard for logout/refresh races.
// 
// When refresh tokens become device/session-specific, logout should invalidate the
// current refresh-token session atomically, and /auth/refresh must verify that the
// session is still active before rotating tokens or issuing a new access token.
// This should prevent an older in-flight refresh request from recreating a session
// after logout.

type AuthSessionEventPayload = {
  type: 'login' | 'logout';
};

const getAuthBroadcastChannel = () => {
  if (typeof window === 'undefined' || typeof window.BroadcastChannel === 'undefined') {
    return null;
  }

  authBroadcastChannel ??= new BroadcastChannel(AUTH_SESSION_EVENT_KEY);
  return authBroadcastChannel;
};

const broadcastAuthSessionEvent = (payload: AuthSessionEventPayload) => {
  getAuthBroadcastChannel()?.postMessage(payload);
};

const setAuthenticatedToken = (token: string) => {
  useAuthStore.getState().setAuthTokenState(token);
};

export const getAuthToken = () => useAuthStore.getState().authToken;

export const setAuthToken = (token: string, { broadcast = false }: { broadcast?: boolean } = {}) => {
  setAuthenticatedToken(token);

  if (broadcast) {
    broadcastAuthSessionEvent({ type: 'login' });
  }
};

export const clearAuthToken = ({ broadcast = true }: { broadcast?: boolean } = {}) => {
  authSessionVersion += 1;
  useAuthStore.getState().clearAuthTokenState();

  if (broadcast) {
    broadcastAuthSessionEvent({ type: 'logout' });
  }
};

export const resetAuthState = ({ broadcast = true }: { broadcast?: boolean } = {}) => {
  authSessionVersion += 1;
  useAuthStore.getState().resetAuthStateState();

  if (broadcast) {
    broadcastAuthSessionEvent({ type: 'logout' });
  }
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
        useAuthStore.getState().clearAuthTokenState();
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

type AuthSessionEventHandlers = {
  onLogin?: () => void;
  onLogout?: () => void;
};

export const subscribeToAuthSessionEvents = ({
  onLogin,
  onLogout,
}: AuthSessionEventHandlers) => {
  const authChannel = getAuthBroadcastChannel();
  const handleBroadcastMessage = (event: MessageEvent<AuthSessionEventPayload>) => {
    if (event.data.type === 'login') {
      onLogin?.();
    }

    if (event.data.type === 'logout') {
      onLogout?.();
    }
  };

  authSessionSubscriberCount += 1;
  authChannel?.addEventListener('message', handleBroadcastMessage);

  return () => {
    authChannel?.removeEventListener('message', handleBroadcastMessage);
    authSessionSubscriberCount = Math.max(0, authSessionSubscriberCount - 1);

    if (authSessionSubscriberCount === 0 && authBroadcastChannel) {
      authBroadcastChannel.close();
      authBroadcastChannel = null;
    }
  };
};
