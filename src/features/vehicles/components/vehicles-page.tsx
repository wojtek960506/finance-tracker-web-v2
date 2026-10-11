import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, LoadingCard } from '@shared/ui';

import { useAllVehiclesSummary } from '../hooks';

import {
  AllVehiclesEmptyState,
  GlobalSummaryCards,
  VehicleCardsGrid,
} from './all-vehicles';

export const VehiclesPage = () => {
  const { t } = useTranslation('vehicles');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { vehicles, summary, hasVehicles, isLoading, error } = useAllVehiclesSummary();

  const handleCreateVehicle = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div
      className="mx-auto flex h-full min-h-0 w-full max-w-[120rem] flex-col gap-4 overflow-y-auto p-1 sm:p-2"
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
          <Button
            variant="primary"
            onClick={handleCreateVehicle}
            className="w-full gap-1.5 whitespace-nowrap sm:w-auto"
          >
            <Plus className="size-4" />
            <span>{t('newVehicle')}</span>
          </Button>
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
          <VehicleCardsGrid vehicles={vehicles} />
        </div>
      )}
    </div>
  );
};
