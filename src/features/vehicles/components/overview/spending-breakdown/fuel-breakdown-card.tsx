import { formatConsumption, formatCostPerKm, formatLiters } from '@vehicles/utils';
import { Fuel } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { BreakdownCard } from './breakdown-card';
import type { FuelBreakdownCardProps } from './types';

export const FuelBreakdownCard = ({ vehicleSlug, fuel }: FuelBreakdownCardProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <BreakdownCard
      title={t('overview.breakdown.fuelTitle')}
      entriesCount={fuel.entriesCount}
      totalSpentPln={fuel.totalSpentPln}
      Icon={Fuel}
      iconClassName="bg-amber-500/10 text-amber-500"
      linkTo={`/vehicles/${vehicleSlug}/fuel`}
      data-testid="breakdown-card-fuel"
    >
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex flex-col rounded-lg bg-card-border/10 p-2">
          <span className="text-[11px] text-text-muted">
            {t('overview.breakdown.totalFuel')}
          </span>
          <span className="mt-0.5 text-xs font-semibold text-fg sm:text-sm">
            {formatLiters(fuel.totalLiters, lang)}
          </span>
        </div>

        <div className="flex flex-col rounded-lg bg-card-border/10 p-2">
          <span className="text-[11px] text-text-muted">
            {t('overview.breakdown.avgConsumption')}
          </span>
          <span className="mt-0.5 text-xs font-semibold text-fg sm:text-sm">
            {formatConsumption(fuel.avgConsumptionLPer100Km, lang)}
          </span>
        </div>

        <div className="flex flex-col rounded-lg bg-card-border/10 p-2">
          <span className="text-[11px] text-text-muted">
            {t('overview.breakdown.costPerKm')}
          </span>
          <span className="mt-0.5 text-xs font-semibold text-fg sm:text-sm">
            {formatCostPerKm(fuel.costPerKmPln, lang)}
          </span>
        </div>
      </div>
    </BreakdownCard>
  );
};
