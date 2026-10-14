import { VehiclePageError, VehiclePageLoading } from '@vehicles/components/common';
import { useVehicleOverview } from '@vehicles/hooks';
import { useTranslation } from 'react-i18next';

import { SingleVehicleLayout, useVehicleContext } from '../single-vehicle';

import { RecentActivityFeed } from './recent-activity';
import { SpendingBreakdown } from './spending-breakdown';
import { VehicleOverviewDetails } from './vehicle-overview-details';
import { VehicleStatsCards } from './vehicle-stats';

export const VehiclesOverviewContent = () => {
  const { t } = useTranslation('vehicles');
  const { vehicle } = useVehicleContext();
  const { overviewData, isLoading, isError, error, refetch } = useVehicleOverview(
    vehicle.id,
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
        testId="vehicles-overview-error"
      />
    );
  }

  const targetSlug = vehicle.slug || vehicle.id;

  return (
    <div className="flex flex-col gap-4 pb-6" data-testid="vehicles-overview-content">
      <VehicleOverviewDetails />

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
