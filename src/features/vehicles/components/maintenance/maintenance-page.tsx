import { VehiclePageError, VehiclePageLoading } from '@vehicles/components/common';
import { useMaintenance } from '@vehicles/hooks';
import type {
  GetMaintenanceQuery,
  MaintenanceSection,
  VehicleMaintenance,
} from '@vehicles/types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SingleVehicleLayout, useVehicleContext } from '../single-vehicle';

import { MaintenanceFilterBar } from './maintenance-filter-bar';
import {
  CreateMaintenanceModal,
  DeleteMaintenanceModal,
  UpdateMaintenanceModal,
} from './maintenance-modals';
import { MaintenanceSectionSwitcher } from './maintenance-section-switcher';
import { MaintenanceSummaryCards } from './maintenance-summary-cards';
import { MaintenanceTable } from './maintenance-table';
import type { MaintenanceFilters, MaintenanceSectionFilter } from './types';

export const VehiclesMaintenanceContent = () => {
  const { t } = useTranslation('vehicles');
  const { vehicle } = useVehicleContext();

  const [filters, setFilters] = useState<MaintenanceFilters>({ section: 'all' });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VehicleMaintenance | null>(null);
  const [deletingItem, setDeletingItem] = useState<VehicleMaintenance | null>(null);

  const queryParams = useMemo(() => {
    const q: GetMaintenanceQuery = {};
    if (filters.startDate) q.startDate = filters.startDate;
    if (filters.endDate) q.endDate = filters.endDate;
    if (filters.section && filters.section !== 'all') {
      q.section = filters.section;
    }
    return Object.keys(q).length > 0 ? q : undefined;
  }, [filters.startDate, filters.endDate, filters.section]);

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

  // Section counts across current items
  const sectionCounts = useMemo(() => {
    const counts: Record<MaintenanceSectionFilter, number> = {
      all: items.length,
      own_maintenance: 0,
      previous_owner_services: 0,
    };
    for (const item of items) {
      if (item.section in counts) {
        counts[item.section as MaintenanceSection]++;
      }
    }
    return counts;
  }, [items]);

  const hasFilters = Boolean(
    filters.search ||
    filters.startDate ||
    filters.endDate ||
    (filters.section && filters.section !== 'all'),
  );

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

      {/* Section Switcher Pills / Tabs */}
      <MaintenanceSectionSwitcher
        selectedSection={filters.section ?? 'all'}
        onSectionChange={(section) => setFilters({ ...filters, section })}
        sectionCounts={filters.section === 'all' ? sectionCounts : undefined}
      />

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
