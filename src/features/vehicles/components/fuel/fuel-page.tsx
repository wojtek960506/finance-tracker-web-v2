import type { VehicleFuelEntryEnriched } from '@vehicles/api';
import { VehiclePageError, VehiclePageLoading } from '@vehicles/components/common';
import { useFuelEntries } from '@vehicles/hooks';
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<VehicleFuelEntryEnriched | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<VehicleFuelEntryEnriched | null>(
    null,
  );

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
      <FuelSummaryCards summary={summary} />

      {/* Filter Bar & Action */}
      <FuelFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onAddEntry={() => setIsCreateOpen(true)}
      />

      {/* Table / Mobile Cards */}
      <FuelTable
        entries={entries}
        hasFilters={hasFilters}
        onEditEntry={(entry) => setEditingEntry(entry)}
        onDeleteEntry={(entry) => setDeletingEntry(entry)}
        onAddFirstEntry={() => setIsCreateOpen(true)}
      />

      {/* CRUD Modals */}
      <CreateFuelEntryModal
        vehicleId={vehicle.id}
        vehicleName={vehicle.name}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <UpdateFuelEntryModal
        vehicleId={vehicle.id}
        entry={editingEntry}
        isOpen={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
      />

      <DeleteFuelEntryModal
        vehicleId={vehicle.id}
        entry={deletingEntry}
        isOpen={Boolean(deletingEntry)}
        onClose={() => setDeletingEntry(null)}
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
