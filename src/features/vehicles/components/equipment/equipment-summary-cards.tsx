import type { VehicleEquipmentSummary } from '@vehicles/api';
import { VehicleStatsCard } from '@vehicles/components/common';
import { SPENDING_TYPE_CONFIG, TOTAL_SPENDING_CONFIG } from '@vehicles/consts';
import { formatPln } from '@vehicles/utils';
import { useTranslation } from 'react-i18next';

export type EquipmentSummaryCardsProps = {
  summary?: VehicleEquipmentSummary;
};

export const EquipmentSummaryCards = ({ summary }: EquipmentSummaryCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const totalCost = summary?.totalCostPln ?? 0;
  const totalItems = summary?.totalItems ?? 0;

  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4"
      data-testid="equipment-summary-cards"
    >
      <VehicleStatsCard
        title={t('equipmentPage.summary.totalSpending')}
        value={formatPln(totalCost, lang)}
        Icon={TOTAL_SPENDING_CONFIG.icon}
        iconClassName={TOTAL_SPENDING_CONFIG.colorClass}
        data-testid="equipment-summary-cost"
      />

      <VehicleStatsCard
        title={t('equipmentPage.summary.totalItems')}
        value={String(totalItems)}
        Icon={SPENDING_TYPE_CONFIG.equipment.icon}
        iconClassName={SPENDING_TYPE_CONFIG.equipment.colorClass}
        data-testid="equipment-summary-count"
      />
    </div>
  );
};
