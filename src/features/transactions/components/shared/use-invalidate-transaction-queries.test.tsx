import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@test-utils/create-test-query-client';

import { useInvalidateTransactionQueries } from './use-invalidate-transaction-queries';

describe('useInvalidateTransactionQueries', () => {
  it('invalidates all query groups by default', async () => {
    const client = createTestQueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(client, 'invalidateQueries')
      .mockResolvedValue(undefined);
    const removeQueriesSpy = vi.spyOn(client, 'removeQueries');
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useInvalidateTransactionQueries(), { wrapper });

    await result.current();

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['transactions'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['transaction'] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['trashed-transactions'],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['trashed-transaction'],
    });
    expect(removeQueriesSpy).not.toHaveBeenCalled();
  });

  it('supports exact invalidation and removal options', async () => {
    const client = createTestQueryClient();
    const invalidateQueriesSpy = vi
      .spyOn(client, 'invalidateQueries')
      .mockResolvedValue(undefined);
    const removeQueriesSpy = vi.spyOn(client, 'removeQueries');
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useInvalidateTransactionQueries(), { wrapper });

    await result.current({
      includeTransactions: false,
      includeTransactionDetails: false,
      includeTrashedTransactions: false,
      includeTrashedTransactionDetails: false,
      invalidateTransactionIds: ['tx-1', undefined],
      invalidateTrashedTransactionIds: ['trash-1', undefined],
      removeTransactionIds: ['tx-2', undefined],
      removeTrashedTransactionIds: ['trash-2', undefined],
      removeAllTrashedTransactionDetails: true,
    });

    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['transaction', 'tx-2'],
      exact: true,
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['trashed-transaction', 'trash-2'],
      exact: true,
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['trashed-transaction'],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['transaction', 'tx-1'],
      exact: true,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['trashed-transaction', 'trash-1'],
      exact: true,
    });
  });
});
