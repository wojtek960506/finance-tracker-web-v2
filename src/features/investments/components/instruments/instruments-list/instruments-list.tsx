import { useTranslation } from 'react-i18next';

import { LoadingCard } from '@shared/ui';

import { useInstrumentsList } from './hooks';
import { InstrumentsListEmptyState } from './instruments-list-empty-state';
import { InstrumentsListGrid } from './instruments-list-grid';
import { InstrumentsListHeader } from './instruments-list-header';
import { InstrumentsListModals } from './instruments-list-modals';

export const InstrumentsList = () => {
  const { t } = useTranslation('investments');

  const {
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
  } = useInstrumentsList();

  if (isLoading) {
    return (
      <LoadingCard
        title={t('loadingTitle', { defaultValue: 'Loading instruments' })}
        description={t('loadingDescription', {
          defaultValue: 'Fetching your investment instruments...',
        })}
        widthClassName="max-w-[35rem]"
      />
    );
  }

  if (error) {
    return <p className="p-4 text-sm text-destructive">{error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-1" data-testid="instruments-list">
      <InstrumentsListHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedKind={selectedKind}
        onSelectedKindChange={setSelectedKind}
        isFetching={isFetching}
        onCreateNew={() => setIsCreateModalOpen(true)}
      />

      {filteredInstruments.length === 0 ? (
        <InstrumentsListEmptyState
          hasAnyInstruments={instruments.length > 0}
          onCreateNew={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <InstrumentsListGrid
          instruments={filteredInstruments}
          onEdit={(inst) => setEditingInstrument(inst)}
          onDelete={(inst) => setDeletingInstrument(inst)}
        />
      )}

      <InstrumentsListModals
        isCreateModalOpen={isCreateModalOpen}
        onCloseCreateModal={() => setIsCreateModalOpen(false)}
        editingInstrument={editingInstrument}
        onCloseEditModal={() => setEditingInstrument(null)}
        deletingInstrument={deletingInstrument}
        onCloseDeleteModal={() => setDeletingInstrument(null)}
      />
    </div>
  );
};
