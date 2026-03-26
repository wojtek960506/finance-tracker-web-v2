import { beforeEach, describe, expect, it } from 'vitest';

import { useThemeStore } from './theme-store';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
    useThemeStore.persist?.clearStorage?.();
  });

  it('defaults to light theme', () => {
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('toggles theme between light and dark', () => {
    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe('dark');

    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe('light');
  });
});
