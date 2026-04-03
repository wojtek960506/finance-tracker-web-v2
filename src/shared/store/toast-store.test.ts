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

  it('creates an RFC 4122-like id from getRandomValues when randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', {
      getRandomValues: vi.fn((array: Uint8Array) => {
        array.set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        return array;
      }),
      randomUUID: undefined,
    });

    expect(createToastId()).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f');
  });
});
