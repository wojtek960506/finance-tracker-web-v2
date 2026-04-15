import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLanguage } from './use-language';

const mocks = vi.hoisted(() => ({
  language: { value: 'en' },
  storedLanguage: { value: 'en' as 'en' | 'pl' | 'de' | 'ru' | null },
  changeLanguage: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: mocks.language.value,
      changeLanguage: mocks.changeLanguage,
    },
  }),
}));

vi.mock('../use-local-storage', () => ({
  useLocalStorage: () => ({
    item: mocks.storedLanguage.value,
    setItem: mocks.setItem,
  }),
}));

describe('useLanguage', () => {
  it('returns stored language when present', () => {
    mocks.language.value = 'en';
    mocks.storedLanguage.value = 'pl';

    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe('pl');
  });

  it('falls back to english when stored language is missing', () => {
    mocks.storedLanguage.value = null;

    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe('en');
  });

  it('changes i18n language when stored language differs', async () => {
    mocks.language.value = 'en';
    mocks.storedLanguage.value = 'pl';

    renderHook(() => useLanguage());

    await waitFor(() => {
      expect(mocks.changeLanguage).toHaveBeenCalledWith('pl');
    });
  });

  it('does not change language when it already matches', async () => {
    mocks.changeLanguage.mockClear();
    mocks.language.value = 'en';
    mocks.storedLanguage.value = 'en';

    renderHook(() => useLanguage());

    await waitFor(() => {
      expect(mocks.changeLanguage).not.toHaveBeenCalled();
    });
  });

  it('updates stored language via setLanguage', () => {
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.setLanguage('de');
    });

    expect(mocks.setItem).toHaveBeenCalledWith('de');
  });
});
