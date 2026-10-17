import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSportRecordModals } from './use-sport-record-modals';

describe('useSportRecordModals', () => {
  it('manages create modal state', () => {
    const { result } = renderHook(() => useSportRecordModals<{ id: string }>());

    expect(result.current.isCreateOpen).toBe(false);

    act(() => {
      result.current.openCreate();
    });
    expect(result.current.isCreateOpen).toBe(true);

    act(() => {
      result.current.closeCreate();
    });
    expect(result.current.isCreateOpen).toBe(false);
  });

  it('manages edit modal state', () => {
    const { result } = renderHook(() => useSportRecordModals<{ id: string }>());
    const item = { id: 'item-1' };

    expect(result.current.editingItem).toBeNull();

    act(() => {
      result.current.openEdit(item);
    });
    expect(result.current.editingItem).toEqual(item);

    act(() => {
      result.current.closeEdit();
    });
    expect(result.current.editingItem).toBeNull();
  });

  it('manages delete modal state', () => {
    const { result } = renderHook(() => useSportRecordModals<{ id: string }>());
    const item = { id: 'item-2' };

    expect(result.current.deletingItem).toBeNull();

    act(() => {
      result.current.openDelete(item);
    });
    expect(result.current.deletingItem).toEqual(item);

    act(() => {
      result.current.closeDelete();
    });
    expect(result.current.deletingItem).toBeNull();
  });

  it('closes all modals at once', () => {
    const { result } = renderHook(() => useSportRecordModals<{ id: string }>());

    act(() => {
      result.current.openCreate();
      result.current.openEdit({ id: 'item-1' });
      result.current.openDelete({ id: 'item-2' });
    });

    act(() => {
      result.current.closeAll();
    });

    expect(result.current.isCreateOpen).toBe(false);
    expect(result.current.editingItem).toBeNull();
    expect(result.current.deletingItem).toBeNull();
  });
});
