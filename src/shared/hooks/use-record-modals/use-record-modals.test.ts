import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useRecordModals } from './use-record-modals';

type Item = { id: string; name: string };

describe('useRecordModals', () => {
  const mockItem: Item = { id: '1', name: 'Test Item' };

  it('initializes with all modal states closed and items null', () => {
    const { result } = renderHook(() => useRecordModals<Item>());

    expect(result.current.isCreateOpen).toBe(false);
    expect(result.current.editingItem).toBeNull();
    expect(result.current.deletingItem).toBeNull();
  });

  it('manages create modal state correctly', () => {
    const { result } = renderHook(() => useRecordModals<Item>());

    act(() => {
      result.current.openCreate();
    });
    expect(result.current.isCreateOpen).toBe(true);

    act(() => {
      result.current.closeCreate();
    });
    expect(result.current.isCreateOpen).toBe(false);

    act(() => {
      result.current.setIsCreateOpen(true);
    });
    expect(result.current.isCreateOpen).toBe(true);
  });

  it('manages editing item state correctly', () => {
    const { result } = renderHook(() => useRecordModals<Item>());

    act(() => {
      result.current.openEdit(mockItem);
    });
    expect(result.current.editingItem).toEqual(mockItem);

    act(() => {
      result.current.closeEdit();
    });
    expect(result.current.editingItem).toBeNull();
  });

  it('manages deleting item state correctly', () => {
    const { result } = renderHook(() => useRecordModals<Item>());

    act(() => {
      result.current.openDelete(mockItem);
    });
    expect(result.current.deletingItem).toEqual(mockItem);

    act(() => {
      result.current.closeDelete();
    });
    expect(result.current.deletingItem).toBeNull();
  });

  it('resets all states when closeAll is called', () => {
    const { result } = renderHook(() => useRecordModals<Item>());

    act(() => {
      result.current.openCreate();
      result.current.openEdit(mockItem);
      result.current.openDelete(mockItem);
    });

    expect(result.current.isCreateOpen).toBe(true);
    expect(result.current.editingItem).toEqual(mockItem);
    expect(result.current.deletingItem).toEqual(mockItem);

    act(() => {
      result.current.closeAll();
    });

    expect(result.current.isCreateOpen).toBe(false);
    expect(result.current.editingItem).toBeNull();
    expect(result.current.deletingItem).toBeNull();
  });
});
