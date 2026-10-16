import type { VehicleEquipment } from '@vehicles/api';
import { VehiclePageError, VehiclePageLoading } from '@vehicles/components/common';
import {
  LinkSpendingModal,
  type SpendingTarget,
  UnlinkSpendingModal,
  useSpendingModalState,
} from '@vehicles/components/spendings';
import { useEquipment, useVehicleRecordModals } from '@vehicles/hooks';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SingleVehicleLayout, useVehicleContext } from '../single-vehicle';

import { EquipmentFilterBar, type EquipmentFilters } from './equipment-filter-bar';
import {
  CreateEquipmentModal,
  DeleteEquipmentModal,
  UpdateEquipmentModal,
} from './equipment-modals';
import { EquipmentSummaryCards } from './equipment-summary-cards';
import { EquipmentTable } from './equipment-table';

export const VehiclesEquipmentContent = () => {
  const { t } = useTranslation('vehicles');
  const { vehicle } = useVehicleContext();

  const [filters, setFilters] = useState<EquipmentFilters>({});
  const {
    isCreateOpen,
    openCreate,
    closeCreate,
    editingItem,
    openEdit: setEditingItem,
    closeEdit: closeEditingItem,
    deletingItem,
    openDelete: setDeletingItem,
    closeDelete: closeDeletingItem,
  } = useVehicleRecordModals<VehicleEquipment>();

  const equipmentToSpendingTarget = (item: VehicleEquipment): SpendingTarget => ({
    id: item.id,
    type: 'equipment',
    costPln: item.costPln,
    date: item.date,
    title: item.itemName,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
  });

  const { linkingTarget, unlinkingTarget, openLink, closeLink, openUnlink, closeUnlink } =
    useSpendingModalState();

  const queryParams = useMemo(() => {
    const q: { startDate?: string; endDate?: string } = {};
    if (filters.startDate) q.startDate = filters.startDate;
    if (filters.endDate) q.endDate = filters.endDate;
    return Object.keys(q).length > 0 ? q : undefined;
  }, [filters.startDate, filters.endDate]);

  const { data, isLoading, isError, error, refetch } = useEquipment(
    vehicle.id,
    queryParams,
  );

  const items = data?.items ?? [];
  const summary = data?.summary;

  const filteredItems = useMemo(() => {
    if (!filters.search) return items;
    const query = filters.search.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)),
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
        testId="vehicles-equipment-error"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="vehicles-equipment-content">
      {/* Summary Cards */}
      {items.length > 0 && <EquipmentSummaryCards summary={summary} />}

      {/* Filter Bar & Action */}
      {(items.length > 0 || hasFilters) && (
        <EquipmentFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          onAddEquipment={openCreate}
        />
      )}

      {/* Table / Mobile Cards */}
      <EquipmentTable
        items={filteredItems}
        hasFilters={hasFilters}
        onEditItem={setEditingItem}
        onDeleteItem={setDeletingItem}
        onLinkItem={(item) => openLink(equipmentToSpendingTarget(item))}
        onUnlinkItem={(item) => openUnlink(equipmentToSpendingTarget(item))}
        onAddFirstItem={openCreate}
      />

      {/* CRUD Modals */}
      <CreateEquipmentModal
        vehicleId={vehicle.id}
        vehicleName={vehicle.name}
        isOpen={isCreateOpen}
        onClose={closeCreate}
      />

      <UpdateEquipmentModal
        vehicleId={vehicle.id}
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={closeEditingItem}
      />

      <DeleteEquipmentModal
        vehicleId={vehicle.id}
        item={deletingItem}
        isOpen={Boolean(deletingItem)}
        onClose={closeDeletingItem}
      />

      {/* Spending Linking Modals */}
      <LinkSpendingModal
        isOpen={Boolean(linkingTarget)}
        target={linkingTarget}
        onClose={closeLink}
        onSuccess={() => void refetch()}
      />

      <UnlinkSpendingModal
        isOpen={Boolean(unlinkingTarget)}
        target={unlinkingTarget}
        onClose={closeUnlink}
        onSuccess={() => void refetch()}
      />
    </div>
  );
};

export const VehiclesEquipmentPage = () => {
  return (
    <SingleVehicleLayout>
      <VehiclesEquipmentContent />
    </SingleVehicleLayout>
  );
};
