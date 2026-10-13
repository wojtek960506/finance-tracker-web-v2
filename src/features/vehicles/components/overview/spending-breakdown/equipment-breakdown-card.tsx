import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { BreakdownCard } from './breakdown-card';
import type { EquipmentBreakdownCardProps } from './types';

export const EquipmentBreakdownCard = ({
  vehicleSlug,
  equipment,
}: EquipmentBreakdownCardProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <BreakdownCard
      title={t('overview.breakdown.equipmentTitle')}
      entriesCount={equipment.entriesCount}
      totalSpentPln={equipment.totalSpentPln}
      Icon={Package}
      iconClassName="bg-emerald-500/10 text-emerald-500"
      linkTo={`/vehicles/${vehicleSlug}/equipment`}
      data-testid="breakdown-card-equipment"
    >
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between rounded-lg bg-card-border/10 p-2.5">
          <span className="text-xs text-text-muted">
            {t('overview.breakdown.totalItems')}
          </span>
          <span className="text-xs font-semibold text-fg sm:text-sm">
            {equipment.entriesCount}
          </span>
        </div>
      </div>
    </BreakdownCard>
  );
};
