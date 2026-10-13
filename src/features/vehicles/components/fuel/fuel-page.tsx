import { useFuelEntries } from '@vehicles/hooks';
import type { VehicleFuelEntryEnriched } from '@vehicles/types';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, LoadingCard } from '@shared/ui';

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

  const {
    data: entries = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFuelEntries(vehicle.id, filters);

  const hasFilters = Boolean(filters.startDate || filters.endDate || filters.isFullTank);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-4">
        <LoadingCard
          title={t('singleVehicle.loadingTitle')}
          description={t('singleVehicle.loadingDescription')}
          widthClassName="max-w-[35rem]"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
        data-testid="vehicles-fuel-error"
      >
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-sm font-semibold text-fg">
          {error?.message || t('toasts.updateErrorTitle')}
        </p>
        <Button variant="secondary" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="vehicles-fuel-content">
      {/* Summary Cards */}
      <FuelSummaryCards entries={entries} />

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
