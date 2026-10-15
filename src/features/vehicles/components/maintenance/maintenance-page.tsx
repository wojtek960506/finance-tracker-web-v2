import type { GetMaintenanceQuery, VehicleMaintenance } from '@vehicles/api';
import { VehiclePageError, VehiclePageLoading } from '@vehicles/components/common';
import { useMaintenance } from '@vehicles/hooks';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SingleVehicleLayout, useVehicleContext } from '../single-vehicle';

import { MaintenanceFilterBar } from './maintenance-filter-bar';
import {
  CreateMaintenanceModal,
  DeleteMaintenanceModal,
  UpdateMaintenanceModal,
} from './maintenance-modals';
import { MaintenanceSummaryCards } from './maintenance-summary-cards';
import { MaintenanceTable } from './maintenance-table';
import type { MaintenanceFilters } from './types';

export const VehiclesMaintenanceContent = () => {
  const { t } = useTranslation('vehicles');
  const { vehicle } = useVehicleContext();

  const [filters, setFilters] = useState<MaintenanceFilters>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VehicleMaintenance | null>(null);
  const [deletingItem, setDeletingItem] = useState<VehicleMaintenance | null>(null);

  const queryParams = useMemo(() => {
    const q: GetMaintenanceQuery = {};
    if (filters.startDate) q.startDate = filters.startDate;
    if (filters.endDate) q.endDate = filters.endDate;
    return Object.keys(q).length > 0 ? q : undefined;
  }, [filters.startDate, filters.endDate]);

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useMaintenance(vehicle.id, queryParams);

  // Client-side search filtering
  const filteredItems = useMemo(() => {
    if (!filters.search) return items;
    const query = filters.search.toLowerCase().trim();
    return items.filter(
      (item) =>
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.serviceProvider && item.serviceProvider.toLowerCase().includes(query)),
    );
  }, [items, filters.search]);

  const hasFilters = Boolean(filters.search || filters.startDate || filters.endDate);

  if (isLoading) {
    return <VehiclePageLoading />;
  }

  if (isError) {
    return (
      <VehiclePageError
        error={error}
        fallbackMessage={t('toasts.updateErrorTitle')}
        onRetry={() => void refetch()}
        testId="vehicles-maintenance-error"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="vehicles-maintenance-content">
      {/* Summary Cards */}
      <MaintenanceSummaryCards items={items} />

      {/* Filter Bar & Action */}
      <MaintenanceFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onAddMaintenance={() => setIsCreateOpen(true)}
      />

      {/* Table / Mobile Cards */}
      <MaintenanceTable
        items={filteredItems}
        hasFilters={hasFilters}
        onEditItem={(item) => setEditingItem(item)}
        onDeleteItem={(item) => setDeletingItem(item)}
        onAddFirstItem={() => setIsCreateOpen(true)}
      />

      {/* CRUD Modals */}
      <CreateMaintenanceModal
        vehicleId={vehicle.id}
        vehicleName={vehicle.name}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <UpdateMaintenanceModal
        vehicleId={vehicle.id}
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
      />

      <DeleteMaintenanceModal
        vehicleId={vehicle.id}
        item={deletingItem}
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
      />
    </div>
  );
};

export const VehiclesMaintenancePage = () => {
  return (
    <SingleVehicleLayout>
      <VehiclesMaintenanceContent />
    </SingleVehicleLayout>
  );
};
