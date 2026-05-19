import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_SESSION_EVENT_KEY } from '@shared/consts';

import {
  clearAuthToken,
  resetAuthState,
  setAuthToken,
  subscribeToAuthSessionEvents,
  useAuthStore,
} from './auth-store';

class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];

  listeners = new Map<string, Set<(event: MessageEvent) => void>>();
  postMessage = vi.fn((data: unknown) => {
    for (const instance of MockBroadcastChannel.instances) {
      if (instance === this) continue;

      const handlers = instance.listeners.get('message') ?? new Set();
      for (const handler of handlers) {
        handler({ data } as MessageEvent);
      }
    }
  });

  constructor(public readonly name: string) {
    MockBroadcastChannel.instances.push(this);
  }

  close = vi.fn();

  addEventListener(type: string, listener: (event: MessageEvent) => void) {
    const handlers = this.listeners.get(type) ?? new Set();
    handlers.add(listener);
    this.listeners.set(type, handlers);
  }

  removeEventListener(type: string, listener: (event: MessageEvent) => void) {
    this.listeners.get(type)?.delete(listener);
  }
}

describe('auth-store', () => {
  beforeEach(() => {
    vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);
    resetAuthState({ broadcast: false });
  });

  it('tracks resolved auth state when token is set', () => {
    setAuthToken('token-123');

    expect(useAuthStore.getState().authToken).toBe('token-123');
    expect(useAuthStore.getState().isAuthResolved).toBe(true);
  });

  it('tracks resolved auth state when token is cleared', () => {
    useAuthStore.getState().setAuthTokenState('token');

    clearAuthToken({ broadcast: false });

    expect(useAuthStore.getState().authToken).toBeNull();
    expect(useAuthStore.getState().isAuthResolved).toBe(true);
  });

  it('resets auth state to unresolved defaults', () => {
    setAuthToken('token-123');

    resetAuthState({ broadcast: false });

    expect(useAuthStore.getState().authToken).toBeNull();
    expect(useAuthStore.getState().isAuthResolved).toBe(false);
  });

  it('broadcasts login events when auth token is set with broadcast enabled', () => {
    setAuthToken('token-123', { broadcast: true });

    const didBroadcastLogin = MockBroadcastChannel.instances.some(
      (instance) =>
        instance.name === AUTH_SESSION_EVENT_KEY
        && instance.postMessage.mock.calls.some(
          ([payload]) => JSON.stringify(payload) === JSON.stringify({ type: 'login' }),
        ),
    );

    expect(didBroadcastLogin).toBe(true);
  });

  it('broadcasts logout events when auth token is cleared', () => {
    clearAuthToken();

    const didBroadcastLogout = MockBroadcastChannel.instances.some(
      (instance) =>
        instance.name === AUTH_SESSION_EVENT_KEY
        && instance.postMessage.mock.calls.some(
          ([payload]) => JSON.stringify(payload) === JSON.stringify({ type: 'logout' }),
        ),
    );

    expect(didBroadcastLogout).toBe(true);
  });

  it('reacts to broadcast login events', () => {
    const onLogin = vi.fn();
    const unsubscribe = subscribeToAuthSessionEvents({ onLogin });

    const sender = new MockBroadcastChannel(AUTH_SESSION_EVENT_KEY);
    sender.postMessage({ type: 'login' });

    expect(onLogin).toHaveBeenCalled();

    unsubscribe();
  });

  it('reacts to broadcast logout events', () => {
    const onLogout = vi.fn();
    const unsubscribe = subscribeToAuthSessionEvents({ onLogout });

    const sender = new MockBroadcastChannel(AUTH_SESSION_EVENT_KEY);
    sender.postMessage({ type: 'logout' });

    expect(onLogout).toHaveBeenCalled();

    unsubscribe();
  });
});
