import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, LoadingCard } from '@shared/ui';

import type { Vehicle, VehicleWithSpending } from '../api';
import { useAllVehiclesSummary } from '../hooks';

import {
  AllVehiclesEmptyState,
  GlobalSummaryCards,
  VehicleCardsGrid,
} from './all-vehicles';
import {
  CreateVehicleModal,
  DeleteVehicleModal,
  UpdateVehicleModal,
} from './vehicle-modals';

export const VehiclesPage = () => {
  const { t } = useTranslation('vehicles');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const { vehicles, summary, hasVehicles, isLoading, error } = useAllVehiclesSummary();

  const handleCreateVehicle = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleWithSpending) => {
    setVehicleToEdit(vehicle);
  };

  const handleDeleteVehicle = (vehicle: VehicleWithSpending) => {
    setVehicleToDelete(vehicle);
  };

  return (
    <div
      className={clsx(
        'mx-auto flex h-full min-h-0 w-full max-w-[120rem] flex-col gap-4',
        'overflow-y-auto p-1 sm:p-2',
      )}
      data-testid="vehicles-page"
    >
      {/* Header & New Vehicle Action */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
            {t('title')}
          </h1>
          <p className="text-xs text-text-muted sm:text-sm">{t('description')}</p>
        </div>

        {hasVehicles && (
          <ButtonWithIcon
            icon={Plus}
            label={t('newVehicle')}
            onClick={handleCreateVehicle}
            className="w-full whitespace-nowrap sm:w-auto"
          />
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingCard
          title={t('loading.title')}
          description={t('loading.description')}
          widthClassName="max-w-[35rem]"
        />
      )}

      {/* Error State */}
      {error && <p className="p-4 text-sm text-destructive">{error.message}</p>}

      {/* Empty State */}
      {!isLoading && !error && !hasVehicles && (
        <AllVehiclesEmptyState onCreateVehicle={handleCreateVehicle} />
      )}

      {/* Main Content: Global Summary + Vehicle Cards Grid */}
      {!isLoading && !error && hasVehicles && (
        <div className="flex flex-col gap-4">
          <GlobalSummaryCards summary={summary} />
          <VehicleCardsGrid
            vehicles={vehicles}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
          />
        </div>
      )}

      {/* CRUD Modals */}
      <CreateVehicleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UpdateVehicleModal
        vehicle={vehicleToEdit}
        isOpen={Boolean(vehicleToEdit)}
        onClose={() => setVehicleToEdit(null)}
      />

      <DeleteVehicleModal
        vehicle={vehicleToDelete}
        isOpen={Boolean(vehicleToDelete)}
        onClose={() => setVehicleToDelete(null)}
      />
    </div>
  );
};
