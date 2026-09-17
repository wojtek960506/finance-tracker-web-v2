import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import {
  getInstruments,
  getOperations,
  type InvestmentInstrument,
  type InvestmentOperation,
} from '@features/investments/api';

export const useOperationsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKind, setSelectedKind] = useState<string>('all');
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>('all');

  const { data: instruments = [], isLoading: isLoadingInstruments } = useQuery({
    queryKey: ['instruments'],
    queryFn: async () => await getInstruments(),
  });

  const {
    data: operations = [],
    isLoading: isLoadingOperations,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['operations'],
    queryFn: async () => await getOperations(),
  });

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedKind('all');
    setSelectedInstrumentId('all');
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedKind !== 'all' ||
    selectedInstrumentId !== 'all';

  const instrumentsMap = useMemo(() => {
    const map = new Map<string, InvestmentInstrument>();
    instruments.forEach((inst) => {
      map.set(inst.id, inst);
    });
    return map;
  }, [instruments]);

  const filteredOperations = useMemo(() => {
    let result = [...operations];

    if (selectedInstrumentId !== 'all') {
      result = result.filter((op) => op.instrumentId === selectedInstrumentId);
    }

    if (selectedKind !== 'all') {
      result = result.filter((op) => op.kind === selectedKind);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((op: InvestmentOperation) => {
        const instrument = instrumentsMap.get(op.instrumentId);
        const matchesInstrumentName = instrument?.name.toLowerCase().includes(query);
        const matchesNote = op.note?.toLowerCase().includes(query);
        return Boolean(matchesInstrumentName || matchesNote);
      });
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [operations, instrumentsMap, searchQuery, selectedKind, selectedInstrumentId]);

  return {
    searchQuery,
    setSearchQuery,
    selectedKind,
    setSelectedKind,
    selectedInstrumentId,
    setSelectedInstrumentId,
    resetFilters,
    hasActiveFilters,
    instruments,
    instrumentsMap,
    operations,
    filteredOperations,
    isLoading: isLoadingInstruments || isLoadingOperations,
    isFetching,
    error,
  };
};
