import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@shared/ui';

import { OperationsListHeader } from '../operations-list-header';

import { useOperationsList } from './hooks';
import { OperationsListEmptyState } from './operations-list-empty-state';
import { OperationsListGrid } from './operations-list-grid';
import { OperationsListModals } from './operations-list-modals';

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
    isCreateSnapshotModalOpen,
    setIsCreateSnapshotModalOpen,
    deletingSnapshot,
    setDeletingSnapshot,
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
      {operations.length > 0 && (
        <OperationsListHeader
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedKind={selectedKind}
          onSelectedKindChange={setSelectedKind}
          selectedInstrumentId={selectedInstrumentId}
          onSelectedInstrumentIdChange={setSelectedInstrumentId}
          instruments={instruments}
          isFetching={isFetching}
          onCreateSnapshot={() => setIsCreateSnapshotModalOpen(true)}
        />
      )}

      {filteredOperations.length === 0 ? (
        <OperationsListEmptyState
          hasAnyOperations={operations.length > 0}
          onCreateSnapshot={() => setIsCreateSnapshotModalOpen(true)}
          onResetFilters={resetFilters}
        />
      ) : (
        <OperationsListGrid
          operations={filteredOperations}
          instrumentsMap={instrumentsMap}
          onDeleteSnapshot={(snapshot) => setDeletingSnapshot(snapshot)}
        />
      )}

      <OperationsListModals
        isCreateSnapshotModalOpen={isCreateSnapshotModalOpen}
        onCloseCreateSnapshotModal={() => setIsCreateSnapshotModalOpen(false)}
        deletingSnapshot={deletingSnapshot}
        onCloseDeleteSnapshotModal={() => setDeletingSnapshot(null)}
        instrumentsMap={instrumentsMap}
      />
    </div>
  );
};
