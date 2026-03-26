import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from './theme-provider';
import { useTheme } from './use-theme';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme', () => {
  it('throws when used outside ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within ThemeProvider',
    );
  });

  it('returns theme context values when provider is present', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('toggleTheme');
  });
});
