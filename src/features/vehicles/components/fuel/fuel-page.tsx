import type { VehicleFuelEntryEnriched } from '@vehicles/api';
import { VehiclePageError, VehiclePageLoading } from '@vehicles/components/common';
import { useFuelEntries, useVehicleRecordModals } from '@vehicles/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SingleVehicleLayout, useVehicleContext } from '../single-vehicle';

import { FuelFilterBar, type FuelFilters } from './fuel-filter-bar';
import {
  CreateFuelEntryModal,
  DeleteFuelEntryModal,
  UpdateFuelEntryModal,
} from './fuel-modals';
import { FuelSummaryCards } from './fuel-summary-cards';
import { FuelTable } from './fuel-table';

export const VehiclesFuelContent = () => {
  const { t } = useTranslation('vehicles');
  const { vehicle } = useVehicleContext();

  const [filters, setFilters] = useState<FuelFilters>({});
  const {
    isCreateOpen,
    openCreate,
    closeCreate,
    editingItem: editingEntry,
    openEdit: setEditingEntry,
    closeEdit: closeEditingEntry,
    deletingItem: deletingEntry,
    openDelete: setDeletingEntry,
    closeDelete: closeDeletingEntry,
  } = useVehicleRecordModals<VehicleFuelEntryEnriched>();

  const { data, isLoading, isError, error, refetch } = useFuelEntries(
    vehicle.id,
    filters,
  );

  const entries = data?.items ?? [];
  const summary = data?.summary;

  const hasFilters = Boolean(filters.startDate || filters.endDate || filters.isFullTank);

  if (isLoading) {
    return <VehiclePageLoading />;
  }

  if (isError) {
    return (
      <VehiclePageError
        error={error}
        fallbackMessage={t('toasts.updateErrorTitle')}
        onRetry={() => void refetch()}
        testId="vehicles-fuel-error"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="vehicles-fuel-content">
      {/* Summary Cards */}
      {entries.length > 0 && <FuelSummaryCards summary={summary} />}

      {/* Filter Bar & Action */}
      {(entries.length > 0 || hasFilters) && (
        <FuelFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onAddEntry={openCreate}
        />
      )}

      {/* Table / Mobile Cards */}
      <FuelTable
        entries={entries}
        hasFilters={hasFilters}
        onEditEntry={setEditingEntry}
        onDeleteEntry={setDeletingEntry}
        onAddFirstEntry={openCreate}
      />

      {/* CRUD Modals */}
      <CreateFuelEntryModal
        vehicleId={vehicle.id}
        vehicleName={vehicle.name}
        isOpen={isCreateOpen}
        onClose={closeCreate}
      />

      <UpdateFuelEntryModal
        vehicleId={vehicle.id}
        entry={editingEntry}
        isOpen={Boolean(editingEntry)}
        onClose={closeEditingEntry}
      />

      <DeleteFuelEntryModal
        vehicleId={vehicle.id}
        entry={deletingEntry}
        isOpen={Boolean(deletingEntry)}
        onClose={closeDeletingEntry}
      />
    </div>
  );
};

export const VehiclesFuelPage = () => {
  return (
    <SingleVehicleLayout>
      <VehiclesFuelContent />
    </SingleVehicleLayout>
  );
};
