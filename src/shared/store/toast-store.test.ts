import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createToastId, useToastStore } from './toast-store';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('pushes toast with default variant and visibility time', () => {
    useToastStore.getState().pushToast({
      message: 'Something went wrong',
    });

    const [toast] = useToastStore.getState().toasts;

    expect(toast).toMatchObject({
      message: 'Something went wrong',
      variant: 'info',
      visibilityTime: 5,
    });
    expect(toast.id).toBeTypeOf('string');
  });

  it('removes toast by id', () => {
    useToastStore.getState().pushToast({
      message: 'First',
    });
    useToastStore.getState().pushToast({
      message: 'Second',
      variant: 'error',
    });

    const [firstToast] = useToastStore.getState().toasts;

    useToastStore.getState().removeToast(firstToast.id);

    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0].message).toBe('Second');
  });

  it('creates a fallback id when randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: undefined,
      randomUUID: undefined,
    });

    expect(createToastId()).toMatch(/^toast-/);
  });
});
