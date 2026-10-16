import { VehicleStatsCard } from '@vehicles/components/common';
import { VEHICLE_OVERVIEW_STATS_CONFIG } from '@vehicles/consts';
import { formatKm } from '@vehicles/utils';
import { useTranslation } from 'react-i18next';

import type { VehicleStatsCardsProps } from './types';

export const VehicleStatsCards = ({ stats }: VehicleStatsCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const distanceLoggedText =
    stats.totalDistanceKm !== null ? `+${formatKm(stats.totalDistanceKm, lang)}` : '-';

  return (
    <div
      className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4"
      data-testid="vehicle-stats-cards"
    >
      <VehicleStatsCard
        title={t('overview.stats.currentOdometer')}
        value={formatKm(stats.currentOdometerKm, lang)}
        Icon={VEHICLE_OVERVIEW_STATS_CONFIG.odometer.icon}
        iconClassName={VEHICLE_OVERVIEW_STATS_CONFIG.odometer.colorClass}
        data-testid="stats-card-odometer"
      />

      <VehicleStatsCard
        title={t('overview.stats.distanceLogged')}
        value={distanceLoggedText}
        Icon={VEHICLE_OVERVIEW_STATS_CONFIG.distance.icon}
        iconClassName={VEHICLE_OVERVIEW_STATS_CONFIG.distance.colorClass}
        data-testid="stats-card-distance"
      />

      <VehicleStatsCard
        title={t('overview.stats.refuelingSessions')}
        value={String(stats.refuelingCount)}
        Icon={VEHICLE_OVERVIEW_STATS_CONFIG.fuel.icon}
        iconClassName={VEHICLE_OVERVIEW_STATS_CONFIG.fuel.colorClass}
        data-testid="stats-card-fuel"
      />

      <VehicleStatsCard
        title={t('overview.stats.maintenanceEvents')}
        value={String(stats.maintenanceCount)}
        Icon={VEHICLE_OVERVIEW_STATS_CONFIG.maintenance.icon}
        iconClassName={VEHICLE_OVERVIEW_STATS_CONFIG.maintenance.colorClass}
        data-testid="stats-card-maintenance"
      />
    </div>
  );
};
