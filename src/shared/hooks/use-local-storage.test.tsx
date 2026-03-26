import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { LOCAL_STORAGE_CHANGE_EVENT } from '@shared/consts';

import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns the default value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current.item).toBe('default');
  });

  it('stores and returns the updated value', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current.setItem('next');
    });

    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('next'));

    await waitFor(() => {
      expect(result.current.item).toBe('next');
    });
  });

  it('removes the value and falls back to default', async () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current.item).toBe('stored');

    act(() => {
      result.current.removeItem();
    });

    expect(window.localStorage.getItem('test-key')).toBeNull();

    await waitFor(() => {
      expect(result.current.item).toBe('default');
    });
  });

  it('reacts to storage events for the same key', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      window.localStorage.setItem('test-key', JSON.stringify('external'));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: JSON.stringify('external'),
        }),
      );
    });

    await waitFor(() => {
      expect(result.current.item).toBe('external');
    });
  });

  it('reacts to custom local storage change events for the same key', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      window.localStorage.setItem('test-key', JSON.stringify('custom'));
      window.dispatchEvent(
        new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, {
          detail: { key: 'test-key' },
        }),
      );
    });

    await waitFor(() => {
      expect(result.current.item).toBe('custom');
    });
  });

  it('ignores events for other keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'other-key',
          newValue: JSON.stringify('ignored'),
        }),
      );
      window.dispatchEvent(
        new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT, {
          detail: { key: 'other-key' },
        }),
      );
    });

    expect(result.current.item).toBe('default');
  });
});
