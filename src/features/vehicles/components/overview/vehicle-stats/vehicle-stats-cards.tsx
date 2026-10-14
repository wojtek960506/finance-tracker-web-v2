import { VehicleStatsCard } from '@vehicles/components/common';
import { formatKm } from '@vehicles/utils';
import { Fuel, Gauge, Milestone, Wrench } from 'lucide-react';
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
        Icon={Gauge}
        iconClassName="text-orange-500"
        data-testid="stats-card-odometer"
      />

      <VehicleStatsCard
        title={t('overview.stats.distanceLogged')}
        value={distanceLoggedText}
        Icon={Milestone}
        iconClassName="text-indigo-500"
        data-testid="stats-card-distance"
      />

      <VehicleStatsCard
        title={t('overview.stats.refuelingSessions')}
        value={String(stats.refuelingCount)}
        Icon={Fuel}
        iconClassName="text-yellow-500"
        data-testid="stats-card-fuel"
      />

      <VehicleStatsCard
        title={t('overview.stats.maintenanceEvents')}
        value={String(stats.maintenanceCount)}
        Icon={Wrench}
        iconClassName="text-sky-500"
        data-testid="stats-card-maintenance"
      />
    </div>
  );
};
