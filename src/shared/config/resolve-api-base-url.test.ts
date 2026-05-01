import { describe, expect, it } from 'vitest';

import { resolveApiBaseUrl } from './resolve-api-base-url';

describe('resolveApiBaseUrl', () => {
  it('falls back to the local backend when the env var is missing', () => {
    expect(resolveApiBaseUrl()).toBe('http://localhost:5000');
  });

  it('removes trailing slashes from absolute URLs', () => {
    expect(resolveApiBaseUrl('https://api.example.com///')).toBe(
      'https://api.example.com',
    );
  });

  it('treats a single slash as same-origin api hosting', () => {
    expect(resolveApiBaseUrl('/')).toBe('');
  });

  it('falls back to the local backend when the env var is blank', () => {
    expect(resolveApiBaseUrl('   ')).toBe('http://localhost:5000');
  });
});
