import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useNavigation } from './use-navigation';

describe('useNavigation', () => {
  it('returns default context value when no provider is present', () => {
    const { result } = renderHook(() => useNavigation());

    expect(result.current).toEqual({ fromLeft: true });
  });

  it('throws when context is undefined', async () => {
    vi.resetModules();
    vi.doMock('react', async () => {
      const actual = await vi.importActual<typeof import('react')>('react');
      return { ...actual, useContext: () => undefined };
    });

    const { useNavigation } = await import('./use-navigation');

    expect(() => useNavigation()).toThrow(
      'useNavigation must be used within NavigationProvider',
    );
  });
});
