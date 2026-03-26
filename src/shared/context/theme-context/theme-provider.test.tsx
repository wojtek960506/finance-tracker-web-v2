import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from './theme-provider';

const mocks = vi.hoisted(() => ({
  themeStoreKey: 'theme-store',
  theme: { value: 'light' as 'light' | 'dark' },
  toggleTheme: vi.fn(),
  rehydrate: vi.fn(),
}));

vi.mock('@store/theme-store', () => ({
  THEME_STORE_KEY: mocks.themeStoreKey,
  useThemeStore: Object.assign(
    () => ({
      theme: mocks.theme.value,
      toggleTheme: mocks.toggleTheme,
    }),
    {
      persist: {
        rehydrate: mocks.rehydrate,
      },
    },
  ),
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('light', 'dark');
    mocks.theme.value = 'light';
    mocks.toggleTheme.mockClear();
    mocks.rehydrate.mockClear();
  });

  it('applies theme class to the document root', () => {
    mocks.theme.value = 'dark';

    render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('reacts to storage events to rehydrate', () => {
    render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );

    window.dispatchEvent(new StorageEvent('storage', { key: mocks.themeStoreKey }));

    expect(mocks.rehydrate).toHaveBeenCalled();
  });

  it('does not react to storage event to rehydrate when it has different name', () => {
    render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );

    window.dispatchEvent(new StorageEvent('storage', { key: 'some other key' }));

    expect(mocks.rehydrate).not.toHaveBeenCalled();
  });

  it('updates class when theme changes', () => {
    const { rerender } = render(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('light')).toBe(true);

    mocks.theme.value = 'dark';

    rerender(
      <ThemeProvider>
        <span>Child</span>
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
