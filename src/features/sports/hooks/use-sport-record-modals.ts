import { useCallback, useState } from 'react';

export const useSportRecordModals = <T>() => {
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
