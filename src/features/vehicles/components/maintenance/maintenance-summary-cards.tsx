import { VehicleStatsCard } from '@vehicles/components/common';
import type { VehicleMaintenance } from '@vehicles/types';
import { formatPln } from '@vehicles/utils';
import { Banknote, ClipboardList, Wrench } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type MaintenanceSummaryCardsProps = {
  items: VehicleMaintenance[];
};

export const MaintenanceSummaryCards = ({ items }: MaintenanceSummaryCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const { totalCount, ownCost, previousOwnerCost } = useMemo(() => {
    let ownCost = 0;
    let previousOwnerCost = 0;

    for (const item of items) {
      const cost = item.costPln || 0;
      if (item.section === 'own_maintenance') {
        ownCost += cost;
      } else if (item.section === 'previous_owner_services') {
        previousOwnerCost += cost;
      }
    }

    return {
      totalCount: items.length,
      ownCost,
      previousOwnerCost,
    };
  }, [items]);

  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4"
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

      <VehicleStatsCard
        title={t('maintenancePage.summary.previousOwner')}
        value={formatPln(previousOwnerCost, lang)}
        Icon={ClipboardList}
        iconClassName="text-purple-500"
        data-testid="maintenance-summary-previous-owner"
      />
    </div>
  );
};
