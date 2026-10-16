import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useVehicleRecordModals } from './use-vehicle-record-modals';

describe('useVehicleRecordModals', () => {
  type TestItem = { id: string; name: string };
  const mockItem: TestItem = { id: '1', name: 'Test' };

  it('initializes with all modals closed and null items', () => {
    const { result } = renderHook(() => useVehicleRecordModals<TestItem>());

    expect(result.current.isCreateOpen).toBe(false);
    expect(result.current.editingItem).toBeNull();
    expect(result.current.deletingItem).toBeNull();
  });

  it('handles create modal open and close', () => {
    const { result } = renderHook(() => useVehicleRecordModals<TestItem>());

    act(() => {
      result.current.openCreate();
    });
    expect(result.current.isCreateOpen).toBe(true);

    act(() => {
      result.current.closeCreate();
    });
    expect(result.current.isCreateOpen).toBe(false);
  });

  it('handles edit modal open and close', () => {
    const { result } = renderHook(() => useVehicleRecordModals<TestItem>());

    act(() => {
      result.current.openEdit(mockItem);
    });
    expect(result.current.editingItem).toEqual(mockItem);

    act(() => {
      result.current.closeEdit();
    });
    expect(result.current.editingItem).toBeNull();
  });

  it('handles delete modal open and close', () => {
    const { result } = renderHook(() => useVehicleRecordModals<TestItem>());

    act(() => {
      result.current.openDelete(mockItem);
    });
    expect(result.current.deletingItem).toEqual(mockItem);

    act(() => {
      result.current.closeDelete();
    });
    expect(result.current.deletingItem).toBeNull();
  });

  it('closes all modals when closeAll is called', () => {
    const { result } = renderHook(() => useVehicleRecordModals<TestItem>());

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
