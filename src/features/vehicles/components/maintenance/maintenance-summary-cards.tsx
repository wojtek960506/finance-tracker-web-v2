import type { VehicleMaintenanceSummary } from '@vehicles/api';
import { VehicleStatsCard } from '@vehicles/components/common';
import { SPENDING_TYPE_CONFIG, TOTAL_SPENDING_CONFIG } from '@vehicles/consts';
import { formatPln } from '@vehicles/utils';
import { useTranslation } from 'react-i18next';

export type MaintenanceSummaryCardsProps = {
  summary?: VehicleMaintenanceSummary;
};

export const MaintenanceSummaryCards = ({ summary }: MaintenanceSummaryCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const totalCost = summary?.totalCostPln ?? 0;
  const totalCount = summary?.totalRecords ?? 0;

  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4"
      data-testid="maintenance-summary-cards"
    >
      <VehicleStatsCard
        title={t('maintenancePage.summary.totalSpending')}
        value={formatPln(totalCost, lang)}
        Icon={TOTAL_SPENDING_CONFIG.icon}
        iconClassName={TOTAL_SPENDING_CONFIG.colorClass}
        data-testid="maintenance-summary-cost"
      />

      <VehicleStatsCard
        title={t('maintenancePage.summary.totalRecords')}
        value={String(totalCount)}
        Icon={SPENDING_TYPE_CONFIG.maintenance.icon}
        iconClassName={SPENDING_TYPE_CONFIG.maintenance.colorClass}
        data-testid="maintenance-summary-count"
      />
    </div>
  );
};
