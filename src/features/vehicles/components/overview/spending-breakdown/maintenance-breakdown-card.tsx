import { Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { BreakdownCard } from './breakdown-card';
import type { MaintenanceBreakdownCardProps } from './types';

export const MaintenanceBreakdownCard = ({
  vehicleSlug,
  maintenance,
}: MaintenanceBreakdownCardProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <BreakdownCard
      title={t('overview.breakdown.maintenanceTitle')}
      entriesCount={maintenance.entriesCount}
      totalSpentPln={maintenance.totalSpentPln}
      Icon={Wrench}
      iconClassName="bg-blue-500/10 text-blue-500"
      linkTo={`/vehicles/${vehicleSlug}/maintenance`}
      data-testid="breakdown-card-maintenance"
    >
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between rounded-lg bg-card-border/10 p-2.5">
          <span className="text-xs text-text-muted">
            {t('overview.breakdown.totalRecords')}
          </span>
          <span className="text-xs font-semibold text-fg sm:text-sm">
            {maintenance.entriesCount}
          </span>
        </div>
      </div>
    </BreakdownCard>
  );
};
