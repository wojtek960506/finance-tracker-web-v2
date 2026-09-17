import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@shared/ui';

import { OperationsFilters } from '../operations-filters';

import { useOperationsList } from './hooks';
import { OperationsListEmptyState } from './operations-list-empty-state';
import { OperationsListGrid } from './operations-list-grid';

export const OperationsList = () => {
  const { t } = useTranslation('investments');

  const {
    searchQuery,
    setSearchQuery,
    selectedKind,
    setSelectedKind,
    selectedInstrumentId,
    setSelectedInstrumentId,
    resetFilters,
    instruments,
    instrumentsMap,
    operations,
    filteredOperations,
    isLoading,
    isFetching,
    error,
  } = useOperationsList();

  if (isLoading) {
    return (
      <LoadingCard
        title={t('operations.loadingTitle')}
        description={t('operations.loadingDescription')}
        widthClassName="max-w-[35rem]"
      />
    );
  }

  if (error) {
    return <p className="p-4 text-sm text-destructive">{error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-1" data-testid="operations-list">
      <OperationsFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedKind={selectedKind}
        onSelectedKindChange={setSelectedKind}
        selectedInstrumentId={selectedInstrumentId}
        onSelectedInstrumentIdChange={setSelectedInstrumentId}
        instruments={instruments}
        isFetching={isFetching}
      />

      {filteredOperations.length === 0 ? (
        <OperationsListEmptyState
          hasAnyOperations={operations.length > 0}
          onResetFilters={resetFilters}
        />
      ) : (
        <OperationsListGrid
          operations={filteredOperations}
          instrumentsMap={instrumentsMap}
        />
      )}
    </div>
  );
};
