import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { SportSpendingTarget } from '../api/types';

import { useSportSpendingModalState } from './use-sport-spending-modal-state';

const mockTarget: SportSpendingTarget = {
  id: 'entry-1',
  costPln: 150,
  date: '2026-05-10',
  itemName: 'Kask rowerowy',
  categoryId: 'cat-1',
  categoryName: 'Rower',
};

const mockTarget2: SportSpendingTarget = {
  id: 'entry-2',
  costPln: 200,
  date: '2026-05-11',
  itemName: 'Rękawiczki',
  categoryId: 'cat-1',
  categoryName: 'Rower',
};

describe('useSportSpendingModalState', () => {
  it('manages linking single target state', () => {
    const { result } = renderHook(() => useSportSpendingModalState());

    expect(result.current.isLinkOpen).toBe(false);
    expect(result.current.linkingTargets).toEqual([]);

    act(() => {
      result.current.openLink(mockTarget);
    });

    expect(result.current.isLinkOpen).toBe(true);
    expect(result.current.linkingTargets).toEqual([mockTarget]);

    act(() => {
      result.current.closeLink();
    });

    expect(result.current.isLinkOpen).toBe(false);
    expect(result.current.linkingTargets).toEqual([]);
  });

  it('manages linking batch targets state', () => {
    const { result } = renderHook(() => useSportSpendingModalState());

    act(() => {
      result.current.openLink([mockTarget, mockTarget2]);
    });

    expect(result.current.isLinkOpen).toBe(true);
    expect(result.current.linkingTargets).toEqual([mockTarget, mockTarget2]);

    act(() => {
      result.current.closeLink();
    });

    expect(result.current.isLinkOpen).toBe(false);
    expect(result.current.linkingTargets).toEqual([]);
  });

  it('manages unlinking target state', () => {
    const { result } = renderHook(() => useSportSpendingModalState());

    expect(result.current.isUnlinkOpen).toBe(false);
    expect(result.current.unlinkingTarget).toBeNull();

    act(() => {
      result.current.openUnlink(mockTarget);
    });

    expect(result.current.isUnlinkOpen).toBe(true);
    expect(result.current.unlinkingTarget).toEqual(mockTarget);

    act(() => {
      result.current.closeUnlink();
    });

    expect(result.current.isUnlinkOpen).toBe(false);
    expect(result.current.unlinkingTarget).toBeNull();
  });
});
