import { beforeEach, describe, expect, it } from 'vitest';

import { useToastStore } from './toast-store';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
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
});
