import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  getInstrument,
  getOperations,
  type InvestmentSnapshotOperation,
} from '@features/investments/api';

import type { InstrumentDetailsContextValue } from '../context';
import { calculateInstrumentMetrics } from '../utils';

export const useInstrumentDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [isCreateSnapshotModalOpen, setIsCreateSnapshotModalOpen] = useState(false);
  const [editingSnapshot, setEditingSnapshot] =
    useState<InvestmentSnapshotOperation | null>(null);
  const [deletingSnapshot, setDeletingSnapshot] =
    useState<InvestmentSnapshotOperation | null>(null);
  const [isUpdateInstrumentModalOpen, setIsUpdateInstrumentModalOpen] = useState(false);
  const [isDeleteInstrumentModalOpen, setIsDeleteInstrumentModalOpen] = useState(false);

  const {
    data: instrument,
    isLoading: isLoadingInstrument,
    error: instrumentError,
  } = useQuery({
    queryKey: ['instrument', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing instrument id');
      return await getInstrument(id);
    },
    enabled: Boolean(id),
  });

  const {
    data: operations = [],
    isLoading: isLoadingOperations,
    error: operationsError,
  } = useQuery({
    queryKey: ['operations', { instrumentId: id }],
    queryFn: async () => {
      if (!id) return [];
      return await getOperations({ instrumentId: id });
    },
    enabled: Boolean(id),
  });

  const openCreateSnapshotModal = useCallback(
    () => setIsCreateSnapshotModalOpen(true),
    [],
  );
  const closeCreateSnapshotModal = useCallback(
    () => setIsCreateSnapshotModalOpen(false),
    [],
  );

  const openEditSnapshotModal = useCallback(
    (snapshot: InvestmentSnapshotOperation) => setEditingSnapshot(snapshot),
    [],
  );
  const closeEditSnapshotModal = useCallback(() => setEditingSnapshot(null), []);

  const openDeleteSnapshotModal = useCallback(
    (snapshot: InvestmentSnapshotOperation) => setDeletingSnapshot(snapshot),
    [],
  );
  const closeDeleteSnapshotModal = useCallback(() => setDeletingSnapshot(null), []);

  const openUpdateInstrumentModal = useCallback(
    () => setIsUpdateInstrumentModalOpen(true),
    [],
  );
  const closeUpdateInstrumentModal = useCallback(
    () => setIsUpdateInstrumentModalOpen(false),
    [],
  );

  const openDeleteInstrumentModal = useCallback(
    () => setIsDeleteInstrumentModalOpen(true),
    [],
  );
  const closeDeleteInstrumentModal = useCallback(
    () => setIsDeleteInstrumentModalOpen(false),
    [],
  );

  const metrics = useMemo(() => calculateInstrumentMetrics(operations), [operations]);

  const contextValue: InstrumentDetailsContextValue | null = useMemo(() => {
    if (!instrument) return null;

    return {
      instrument,
      operations,
      metrics,
      currency: instrument.currency ?? '',
      isCreateSnapshotModalOpen,
      openCreateSnapshotModal,
      closeCreateSnapshotModal,
      editingSnapshot,
      openEditSnapshotModal,
      closeEditSnapshotModal,
      deletingSnapshot,
      openDeleteSnapshotModal,
      closeDeleteSnapshotModal,
      isUpdateInstrumentModalOpen,
      openUpdateInstrumentModal,
      closeUpdateInstrumentModal,
      isDeleteInstrumentModalOpen,
      openDeleteInstrumentModal,
      closeDeleteInstrumentModal,
    };
  }, [
    instrument,
    operations,
    metrics,
    isCreateSnapshotModalOpen,
    openCreateSnapshotModal,
    closeCreateSnapshotModal,
    editingSnapshot,
    openEditSnapshotModal,
    closeEditSnapshotModal,
    deletingSnapshot,
    openDeleteSnapshotModal,
    closeDeleteSnapshotModal,
    isUpdateInstrumentModalOpen,
    openUpdateInstrumentModal,
    closeUpdateInstrumentModal,
    isDeleteInstrumentModalOpen,
    openDeleteInstrumentModal,
    closeDeleteInstrumentModal,
  ]);

  return {
    isLoading: isLoadingInstrument || isLoadingOperations,
    error: instrumentError || operationsError,
    instrument,
    contextValue,
  };
};
