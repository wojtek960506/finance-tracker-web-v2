import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import {
  getInstruments,
  getInvestmentSummary,
  type InvestmentInstrument,
} from '@features/investments/api';

export const useInstrumentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKind, setSelectedKind] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<InvestmentInstrument | null>(
    null,
  );
  const [deletingInstrument, setDeletingInstrument] =
    useState<InvestmentInstrument | null>(null);

  const {
    data: instruments = [],
    isLoading: isLoadingInstruments,
    isFetching: isFetchingInstruments,
    error: instrumentsError,
  } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => await getInstruments(),
  });

  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isFetching: isFetchingSummary,
    error: summaryError,
  } = useQuery({
    queryKey: ['investments-summary'],
    queryFn: async () => await getInvestmentSummary(),
  });

  const statusMap = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!summaryData?.instruments) return map;
    for (const inst of summaryData.instruments) {
      map.set(inst.id, inst.currentValue === 0);
    }
    return map;
  }, [summaryData]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedKind('all');
    setSelectedStatus('all');
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || selectedKind !== 'all' || selectedStatus !== 'all';

  const filteredInstruments = useMemo(() => {
    return instruments
      .filter((inst) => {
        const matchesSearch =
          !searchQuery.trim() ||
          inst.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          (inst.notes &&
            inst.notes.toLowerCase().includes(searchQuery.trim().toLowerCase()));

        const matchesKind = selectedKind === 'all' || inst.kind === selectedKind;

        const isClosed = statusMap.get(inst.id) ?? true;
        const matchesStatus =
          selectedStatus === 'all' ||
          (selectedStatus === 'active' && !isClosed) ||
          (selectedStatus === 'closed' && isClosed);

        return matchesSearch && matchesKind && matchesStatus;
      })
      .sort((a, b) => {
        const aClosed = statusMap.get(a.id) ?? true;
        const bClosed = statusMap.get(b.id) ?? true;
        if (aClosed !== bClosed) {
          return aClosed ? 1 : -1;
        }
        return 0;
      });
  }, [instruments, searchQuery, selectedKind, selectedStatus, statusMap]);

  return {
    searchQuery,
    setSearchQuery,
    selectedKind,
    setSelectedKind,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
    hasActiveFilters,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingInstrument,
    setEditingInstrument,
    deletingInstrument,
    setDeletingInstrument,
    instruments,
    statusMap,
    filteredInstruments,
    isLoading: isLoadingInstruments || isLoadingSummary,
    isFetching: isFetchingInstruments || isFetchingSummary,
    error: instrumentsError || summaryError,
  };
};
