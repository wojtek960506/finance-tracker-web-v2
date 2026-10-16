import '@shared/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import * as vehiclesApi from '@vehicles/api';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useToastStore } from '@store/toast-store';
import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { useSpendingLinking } from './use-spending-linking';

describe('useSpendingLinking', () => {
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

  it('links spending successfully and triggers toasts and callback', async () => {
    const pushToastSpy = vi.spyOn(useToastStore.getState(), 'pushToast');
    const linkSpy = vi.spyOn(vehiclesApi, 'linkSpendings').mockResolvedValueOnce({
      acknowledged: true,
      modifiedCount: 1,
    });
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useSpendingLinking({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.linkSpendings({
        transactionId: 'tx-1',
        spendings: [{ spendingType: 'fuel', spendingId: 'f-1' }],
      });
    });

    expect(linkSpy).toHaveBeenCalledWith({
      transactionId: 'tx-1',
      spendings: [{ spendingType: 'fuel', spendingId: 'f-1' }],
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(pushToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success' }),
    );
  });

  it('handles link spending failure and triggers error toast', async () => {
    const pushToastSpy = vi.spyOn(useToastStore.getState(), 'pushToast');
    vi.spyOn(vehiclesApi, 'linkSpendings').mockRejectedValueOnce(
      new Error('Transaction not found'),
    );
    const onError = vi.fn();

    const { result } = renderHook(() => useSpendingLinking({ onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.linkSpendings({
          transactionId: 'tx-invalid',
          spendings: [{ spendingType: 'fuel', spendingId: 'f-1' }],
        });
      } catch {
        // expected error
      }
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(pushToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    );
  });

  it('unlinks spending successfully and triggers toasts and callback', async () => {
    const pushToastSpy = vi.spyOn(useToastStore.getState(), 'pushToast');
    const unlinkSpy = vi.spyOn(vehiclesApi, 'unlinkSpending').mockResolvedValueOnce({
      acknowledged: true,
      modifiedCount: 1,
    });
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useSpendingLinking({ onSuccess }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.unlinkSpending({
        spendingType: 'maintenance',
        spendingId: 'm-1',
      });
    });

    expect(unlinkSpy).toHaveBeenCalledWith({
      spendingType: 'maintenance',
      spendingId: 'm-1',
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(pushToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success' }),
    );
  });

  it('handles unlink spending failure and triggers error toast', async () => {
    const pushToastSpy = vi.spyOn(useToastStore.getState(), 'pushToast');
    vi.spyOn(vehiclesApi, 'unlinkSpending').mockRejectedValueOnce(
      new Error('Spending not found'),
    );
    const onError = vi.fn();

    const { result } = renderHook(() => useSpendingLinking({ onError }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.unlinkSpending({
          spendingType: 'equipment',
          spendingId: 'eq-invalid',
        });
      } catch {
        // expected error
      }
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(pushToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' }),
    );
  });
});
