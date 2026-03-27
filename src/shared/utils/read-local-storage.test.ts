import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { readLocalStorage } from './read-local-storage';

describe('readLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the default value when the key is missing', () => {
    expect(readLocalStorage('missing-key', 'fallback')).toBe('fallback');
  });

  it('returns null when the key is missing and no default is provided', () => {
    expect(readLocalStorage('missing-key')).toBeNull();
  });

  it('parses and returns stored JSON values', () => {
    window.localStorage.setItem('stored-key', JSON.stringify({ a: 1 }));

    expect(readLocalStorage<{ a: number }>('stored-key')).toEqual({ a: 1 });
  });

  it('returns the default value when stored JSON is invalid', () => {
    window.localStorage.setItem('broken-key', 'not-json');

    expect(readLocalStorage('broken-key', 'fallback')).toBe('fallback');
  });

  it('returns the default value when window is undefined', () => {
    vi.stubGlobal('window', undefined);

    expect(readLocalStorage('missing-key', 'fallback')).toBe('fallback');
  });
});
