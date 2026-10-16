import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SpendingTarget } from './types';
import { useSpendingModalState } from './use-spending-modal-state';

describe('useSpendingModalState', () => {
  const mockTarget: SpendingTarget = {
    id: 'fuel-1',
    type: 'fuel',
    costPln: 200,
    date: '2026-10-15T00:00:00.000Z',
    title: 'Orlen Fuel',
  };

  it('initializes with closed states and null targets', () => {
    const { result } = renderHook(() => useSpendingModalState());

    expect(result.current.linkingTarget).toBeNull();
    expect(result.current.unlinkingTarget).toBeNull();
    expect(result.current.isLinkOpen).toBe(false);
    expect(result.current.isUnlinkOpen).toBe(false);
  });

  it('opens and closes linking target modal', () => {
    const { result } = renderHook(() => useSpendingModalState());

    act(() => {
      result.current.openLink(mockTarget);
    });

    expect(result.current.linkingTarget).toEqual(mockTarget);
    expect(result.current.isLinkOpen).toBe(true);

    act(() => {
      result.current.closeLink();
    });

    expect(result.current.linkingTarget).toBeNull();
    expect(result.current.isLinkOpen).toBe(false);
  });

  it('opens and closes unlinking target modal', () => {
    const { result } = renderHook(() => useSpendingModalState());

    act(() => {
      result.current.openUnlink(mockTarget);
    });

    expect(result.current.unlinkingTarget).toEqual(mockTarget);
    expect(result.current.isUnlinkOpen).toBe(true);

    act(() => {
      result.current.closeUnlink();
    });

    expect(result.current.unlinkingTarget).toBeNull();
    expect(result.current.isUnlinkOpen).toBe(false);
  });
});
