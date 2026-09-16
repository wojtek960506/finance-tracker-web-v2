import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { getInstruments, type InvestmentInstrument } from '@features/investments/api';

export const useInstrumentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKind, setSelectedKind] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<InvestmentInstrument | null>(
    null,
  );
  const [deletingInstrument, setDeletingInstrument] =
    useState<InvestmentInstrument | null>(null);

  const {
    data: instruments = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => await getInstruments(),
  });

  const filteredInstruments = useMemo(() => {
    return instruments.filter((inst) => {
      const matchesSearch =
        !searchQuery.trim() ||
        inst.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (inst.notes &&
          inst.notes.toLowerCase().includes(searchQuery.trim().toLowerCase()));

      const matchesKind = selectedKind === 'all' || inst.kind === selectedKind;

      return matchesSearch && matchesKind;
    });
  }, [instruments, searchQuery, selectedKind]);

  return {
    searchQuery,
    setSearchQuery,
    selectedKind,
    setSelectedKind,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingInstrument,
    setEditingInstrument,
    deletingInstrument,
    setDeletingInstrument,
    instruments,
    filteredInstruments,
    isLoading,
    isFetching,
    error,
  };
};
