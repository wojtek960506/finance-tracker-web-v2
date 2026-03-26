import { describe, expect, it } from 'vitest';

import { useUIStore } from './ui-store';

describe('useUIStore', () => {
  it('defaults to nav closed', () => {
    expect(useUIStore.getState().isNavOpen).toBe(false);
  });

  it('updates nav state via setIsNavOpen', () => {
    useUIStore.getState().setIsNavOpen(true);

    expect(useUIStore.getState().isNavOpen).toBe(true);
  });
});
