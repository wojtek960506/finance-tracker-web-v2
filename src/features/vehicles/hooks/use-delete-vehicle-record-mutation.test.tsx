import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useToastStore } from '@store/toast-store';

import { useDeleteVehicleRecordMutation } from './use-delete-vehicle-record-mutation';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, Wrapper };
};

describe('useDeleteVehicleRecordMutation', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('handles successful deletion by invalidating cache, displaying toast, and invoking callbacks', async () => {
    const { queryClient, Wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const mutationFn = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useDeleteVehicleRecordMutation({
          mutationFn,
          successTitle: 'Deleted Successfully',
          errorTitle: 'Failed to Delete',
          onClose,
          onSuccess,
        }),
      { wrapper: Wrapper },
    );

    await result.current.mutateAsync();

    expect(mutationFn).toHaveBeenCalledTimes(1);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: vehiclesQueryKeys.all });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.title).toBe('Deleted Successfully');
    expect(toasts[0]?.variant).toBe('success');
  });

  it('handles failed deletion by displaying error toast and preserving open state', async () => {
    const { Wrapper } = createWrapper();
    const mutationFn = vi.fn().mockRejectedValue(new Error('Network failure'));
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useDeleteVehicleRecordMutation({
          mutationFn,
          successTitle: 'Deleted Successfully',
          errorTitle: 'Failed to Delete',
          onClose,
          onSuccess,
          onError,
        }),
      { wrapper: Wrapper },
    );

    await expect(result.current.mutateAsync()).rejects.toThrow('Network failure');

    await waitFor(() => {
      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0]?.title).toBe('Failed to Delete');
      expect(toasts[0]?.variant).toBe('error');
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
