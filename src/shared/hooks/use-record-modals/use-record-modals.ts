import { useCallback, useState } from 'react';

export interface UseRecordModalsReturn<T> {
  isCreateOpen: boolean;
  openCreate: () => void;
  closeCreate: () => void;
  setIsCreateOpen: (isOpen: boolean) => void;
  editingItem: T | null;
  openEdit: (item: T) => void;
  closeEdit: () => void;
  setEditingItem: (item: T | null) => void;
  deletingItem: T | null;
  openDelete: (item: T) => void;
  closeDelete: () => void;
  setDeletingItem: (item: T | null) => void;
  closeAll: () => void;
}

export const useRecordModals = <T>(): UseRecordModalsReturn<T> => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);

  const openCreate = useCallback(() => setIsCreateOpen(true), []);
  const closeCreate = useCallback(() => setIsCreateOpen(false), []);

  const openEdit = useCallback((item: T) => setEditingItem(item), []);
  const closeEdit = useCallback(() => setEditingItem(null), []);

  const openDelete = useCallback((item: T) => setDeletingItem(item), []);
  const closeDelete = useCallback(() => setDeletingItem(null), []);

  const closeAll = useCallback(() => {
    setIsCreateOpen(false);
    setEditingItem(null);
    setDeletingItem(null);
  }, []);

  return {
    isCreateOpen,
    openCreate,
    closeCreate,
    setIsCreateOpen,
    editingItem,
    openEdit,
    closeEdit,
    setEditingItem,
    deletingItem,
    openDelete,
    closeDelete,
    setDeletingItem,
    closeAll,
  };
};
