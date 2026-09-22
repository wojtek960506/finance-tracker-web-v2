import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  getInstrument,
  getOperations,
  type InvestmentOperation,
} from '@features/investments/api';

import type { InstrumentDetailsContextValue } from '../context';

export const useInstrumentDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [isCreateOperationModalOpen, setIsCreateOperationModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<InvestmentOperation | null>(
    null,
  );
  const [deletingOperation, setDeletingOperation] = useState<InvestmentOperation | null>(
    null,
  );
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

  const openCreateOperationModal = useCallback(
    () => setIsCreateOperationModalOpen(true),
    [],
  );
  const closeCreateOperationModal = useCallback(
    () => setIsCreateOperationModalOpen(false),
    [],
  );

  const openEditOperationModal = useCallback(
    (operation: InvestmentOperation) => setEditingOperation(operation),
    [],
  );
  const closeEditOperationModal = useCallback(() => setEditingOperation(null), []);

  const openDeleteOperationModal = useCallback(
    (operation: InvestmentOperation) => setDeletingOperation(operation),
    [],
  );
  const closeDeleteOperationModal = useCallback(() => setDeletingOperation(null), []);

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

  const contextValue: InstrumentDetailsContextValue | null = useMemo(() => {
    if (!instrument) return null;

    return {
      instrument,
      operations,
      currency: instrument.currency ?? '',
      isCreateOperationModalOpen,
      openCreateOperationModal,
      closeCreateOperationModal,
      editingOperation,
      openEditOperationModal,
      closeEditOperationModal,
      deletingOperation,
      openDeleteOperationModal,
      closeDeleteOperationModal,
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
    isCreateOperationModalOpen,
    openCreateOperationModal,
    closeCreateOperationModal,
    editingOperation,
    openEditOperationModal,
    closeEditOperationModal,
    deletingOperation,
    openDeleteOperationModal,
    closeDeleteOperationModal,
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
