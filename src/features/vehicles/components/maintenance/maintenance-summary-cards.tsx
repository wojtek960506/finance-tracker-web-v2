import type { VehicleMaintenance } from '@vehicles/api';
import { VehicleStatsCard } from '@vehicles/components/common';
import { formatPln } from '@vehicles/utils';
import { Banknote, Wrench } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type MaintenanceSummaryCardsProps = {
  items: VehicleMaintenance[];
};

export const MaintenanceSummaryCards = ({ items }: MaintenanceSummaryCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const { totalCount, ownCost } = useMemo(() => {
    let ownCost = 0;

    for (const item of items) {
      if (item.section === 'ownMaintenance') {
        ownCost += item.costPln || 0;
      }
    }

    return {
      totalCount: items.length,
      ownCost,
    };
  }, [items]);

  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4"
      data-testid="maintenance-summary-cards"
    >
      <VehicleStatsCard
        title={t('maintenancePage.summary.totalSpending')}
        value={formatPln(ownCost, lang)}
        Icon={Banknote}
        iconClassName="text-emerald-500"
        data-testid="maintenance-summary-cost"
      />

      <VehicleStatsCard
        title={t('maintenancePage.summary.totalRecords')}
        value={String(totalCount)}
        Icon={Wrench}
        iconClassName="text-blue-500"
        data-testid="maintenance-summary-count"
      />
    </div>
  );
};
