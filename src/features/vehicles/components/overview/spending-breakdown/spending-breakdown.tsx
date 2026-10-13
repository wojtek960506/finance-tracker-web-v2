import { formatPln } from '@vehicles/utils';
import { useTranslation } from 'react-i18next';

import { EquipmentBreakdownCard } from './equipment-breakdown-card';
import { FuelBreakdownCard } from './fuel-breakdown-card';
import { MaintenanceBreakdownCard } from './maintenance-breakdown-card';
import type { SpendingBreakdownProps } from './types';

export const SpendingBreakdown = ({
  vehicleSlug,
  totalSpentPln,
  fuel,
  maintenance,
  equipment,
}: SpendingBreakdownProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <div className="flex flex-col gap-3" data-testid="vehicle-spending-breakdown">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-fg sm:text-lg">
            {t('overview.breakdown.title')}
          </h2>
          <p className="text-xs text-text-muted">{t('overview.breakdown.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-card-border/20 px-3 py-1">
          <span className="text-xs text-text-muted">
            {t('overview.totalSpentTitle')}:
          </span>
          <span className="text-sm font-bold text-fg sm:text-base">
            {formatPln(totalSpentPln, lang)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FuelBreakdownCard vehicleSlug={vehicleSlug} fuel={fuel} />
        <MaintenanceBreakdownCard vehicleSlug={vehicleSlug} maintenance={maintenance} />
        <EquipmentBreakdownCard vehicleSlug={vehicleSlug} equipment={equipment} />
      </div>
    </div>
  );
};
