import { useVehicleOverview } from '@vehicles/hooks';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, LoadingCard } from '@shared/ui';

import { SingleVehicleLayout, useVehicleContext } from '../single-vehicle';

import { RecentActivityFeed } from './recent-activity';
import { SpendingBreakdown } from './spending-breakdown';
import { VehicleStatsCards } from './vehicle-stats';

export const VehiclesOverviewContent = () => {
  const { t } = useTranslation('vehicles');
  const { vehicle } = useVehicleContext();
  const { overviewData, isLoading, isError, error, refetch } = useVehicleOverview(
    vehicle.id,
  );

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
        data-testid="vehicles-overview-error"
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

  const targetSlug = vehicle.slug || vehicle.id;

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="vehicles-overview-content">
      <VehicleStatsCards stats={overviewData.stats} />

      <SpendingBreakdown
        vehicleSlug={targetSlug}
        totalSpentPln={overviewData.totalSpentPln}
        fuel={overviewData.fuel}
        maintenance={overviewData.maintenance}
        equipment={overviewData.equipment}
      />

      <RecentActivityFeed items={overviewData.recentActivity} vehicleSlug={targetSlug} />
    </div>
  );
};

export const VehiclesOverviewPage = () => {
  return (
    <SingleVehicleLayout>
      <VehiclesOverviewContent />
    </SingleVehicleLayout>
  );
};
