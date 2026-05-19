import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@test-utils';

import App from './App';

const mocks = vi.hoisted(() => ({
  isAuthenticated: { value: false },
  isAuthResolved: { value: true },
  subscribeToAuthSessionEvents: vi.fn(() => vi.fn()),
}));

vi.mock('@shared/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/hooks')>();

  return {
    ...actual,
    useAuthToken: () => ({
      isAuthenticated: mocks.isAuthenticated.value,
      isAuthResolved: mocks.isAuthResolved.value,
    }),
  };
});

vi.mock('@shared/store/auth-store', () => ({
  subscribeToAuthSessionEvents: mocks.subscribeToAuthSessionEvents,
  getAuthToken: vi.fn(),
  refreshAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    mocks.isAuthenticated.value = false;
    mocks.isAuthResolved.value = true;
    mocks.subscribeToAuthSessionEvents.mockClear();
    mocks.subscribeToAuthSessionEvents.mockReturnValue(vi.fn());
  });

  it('renders the Finance Tracker title', () => {
    renderWithProviders(<App />);

    expect(screen.getByText(/finance tracker/i)).toBeInTheDocument();
  });

  it('renders auth bootstrap loading state while resolving auth', () => {
    mocks.isAuthResolved.value = false;

    renderWithProviders(<App />);

    expect(screen.getByText('Restoring your session')).toBeInTheDocument();
    expect(
      screen.getByText('Please wait while we check whether you are still signed in.'),
    ).toBeInTheDocument();
  });

  it('subscribes to auth session events on mount', () => {
    renderWithProviders(<App />);

    expect(mocks.subscribeToAuthSessionEvents).toHaveBeenCalled();
  });
});
