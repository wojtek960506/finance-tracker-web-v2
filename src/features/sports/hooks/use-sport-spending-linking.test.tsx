import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useToastStore } from '@store/toast-store';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import * as sportsApi from '../api/sport-spendings-api';

import { useSportSpendingLinking } from './use-sport-spending-linking';

describe('useSportSpendingLinking', () => {
  let queryClient = createTestQueryClient();

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  it('links sport spendings successfully and triggers toasts and callback', async () => {
    const pushToastSpy = vi.spyOn(useToastStore.getState(), 'pushToast');
    const linkSpy = vi.spyOn(sportsApi, 'linkSportSpendings').mockResolvedValueOnce({
      acknowledged: true,
      modifiedCount: 2,
    });
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useSportSpendingLinking({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.linkSpendings({
        transactionId: 'tx-1',
        entryIds: ['e-1', 'e-2'],
      });
    });

    expect(linkSpy).toHaveBeenCalledWith({
      transactionId: 'tx-1',
      entryIds: ['e-1', 'e-2'],
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(pushToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success' }),
    );
  });

  it('handles link failure and triggers error toast and callback', async () => {
    const pushToastSpy = vi.spyOn(useToastStore.getState(), 'pushToast');
    vi.spyOn(sportsApi, 'linkSportSpendings').mockRejectedValueOnce(
      new Error('Transaction not found'),
    );
    const onError = vi.fn();

    const { result } = renderHook(() => useSportSpendingLinking({ onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.linkSpendings({
          transactionId: 'tx-missing',
          entryIds: ['e-1'],
        });
      } catch {
        // Expected error
      }
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(pushToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    );
  });

  it('unlinks sport spending successfully and triggers toasts and callback', async () => {
    const pushToastSpy = vi.spyOn(useToastStore.getState(), 'pushToast');
    const unlinkSpy = vi.spyOn(sportsApi, 'unlinkSportSpending').mockResolvedValueOnce({
      acknowledged: true,
      modifiedCount: 1,
    });
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useSportSpendingLinking({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.unlinkSpending({
        entryId: 'e-1',
      });
    });

    expect(unlinkSpy).toHaveBeenCalledWith({
      entryId: 'e-1',
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(pushToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success' }),
    );
  });

  it('handles unlink failure and triggers error toast', async () => {
    const pushToastSpy = vi.spyOn(useToastStore.getState(), 'pushToast');
    vi.spyOn(sportsApi, 'unlinkSportSpending').mockRejectedValueOnce(
      new Error('Entry not found'),
    );
    const onError = vi.fn();

    const { result } = renderHook(() => useSportSpendingLinking({ onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.unlinkSpending({
          entryId: 'e-missing',
        });
      } catch {
        // Expected error
      }
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(pushToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    );
  });
});
