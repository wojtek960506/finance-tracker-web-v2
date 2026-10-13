import { formatPln } from '@vehicles/utils';
import { Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { BreakdownCard } from './breakdown-card';
import type { MaintenanceBreakdownCardProps } from './types';

export const MaintenanceBreakdownCard = ({
  vehicleSlug,
  maintenance,
}: MaintenanceBreakdownCardProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const sections = [
    {
      key: 'own_maintenance' as const,
      label: t('overview.maintenanceSections.own_maintenance'),
      data: maintenance.bySection.own_maintenance,
    },
    {
      key: 'previous_owner_services' as const,
      label: t('overview.maintenanceSections.previous_owner_services'),
      data: maintenance.bySection.previous_owner_services,
    },
    {
      key: 'driving_licence_costs' as const,
      label: t('overview.maintenanceSections.driving_licence_costs'),
      data: maintenance.bySection.driving_licence_costs,
    },
  ];

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
        {sections.map(({ key, label, data }) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg bg-card-border/10 px-2.5 py-1.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">{label}</span>
              <span className="text-[11px] text-text-muted/70">({data.count})</span>
            </div>
            <span className="text-xs font-semibold text-fg">
              {formatPln(data.costPln, lang)}
            </span>
          </div>
        ))}
      </div>
    </BreakdownCard>
  );
};
