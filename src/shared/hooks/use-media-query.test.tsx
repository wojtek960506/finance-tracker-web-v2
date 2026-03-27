import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMediaQuery } from './use-media-query';

describe('useMediaQuery', () => {
  let listeners: Array<(event: Event) => void> = [];
  let mediaQueryList: {
    matches: boolean;
    addEventListener: (type: string, listener: (event: Event) => void) => void;
    removeEventListener: (type: string, listener: (event: Event) => void) => void;
  };

  beforeEach(() => {
    listeners = [];
    mediaQueryList = {
      matches: false,
      addEventListener: (_type, listener) => {
        listeners.push(listener);
      },
      removeEventListener: (_type, listener) => {
        listeners = listeners.filter((item) => item !== listener);
      },
    };

    window.matchMedia = vi.fn().mockImplementation(() => mediaQueryList);
  });

  it('returns initial match state and updates on change', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'));

    expect(result.current).toBe(false);

    act(() => {
      mediaQueryList.matches = true;
      listeners.forEach((listener) => listener(new Event('change')));
    });

    expect(result.current).toBe(true);
  });

  it('removes listeners on unmount', () => {
    const removeSpy = vi.spyOn(mediaQueryList, 'removeEventListener');

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 600px)'));

    unmount();

    expect(removeSpy).toHaveBeenCalled();
  });
});
