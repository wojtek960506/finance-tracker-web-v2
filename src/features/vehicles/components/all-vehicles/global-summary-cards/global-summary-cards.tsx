import type { GlobalVehiclesSummary } from '@vehicles/api';
import { VehicleStatsCard } from '@vehicles/components/common';
import { formatPln } from '@vehicles/utils';
import { Banknote, Fuel, Package, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type GlobalSummaryCardsProps = {
  summary: GlobalVehiclesSummary;
};

export const GlobalSummaryCards = ({ summary }: GlobalSummaryCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <div
      className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4"
      data-testid="global-spending-summary-cards"
    >
      <VehicleStatsCard
        title={t('summary.totalSpending')}
        value={formatPln(summary.totalSpentPln, lang)}
        subtext={`${summary.totalVehicles} ${t('summary.totalVehicles').toLowerCase()}`}
        Icon={Banknote}
        iconClassName="text-active-nav"
        data-testid="summary-card-total"
      />

      <VehicleStatsCard
        title={t('summary.fuelSpending')}
        value={formatPln(summary.totalFuelSpentPln, lang)}
        Icon={Fuel}
        iconClassName="text-amber-500"
        data-testid="summary-card-fuel"
      />

      <VehicleStatsCard
        title={t('summary.maintenanceSpending')}
        value={formatPln(summary.totalMaintenanceSpentPln, lang)}
        Icon={Wrench}
        iconClassName="text-blue-500"
        data-testid="summary-card-maintenance"
      />

      <VehicleStatsCard
        title={t('summary.equipmentSpending')}
        value={formatPln(summary.totalEquipmentSpentPln, lang)}
        Icon={Package}
        iconClassName="text-emerald-500"
        data-testid="summary-card-equipment"
      />
    </div>
  );
};
