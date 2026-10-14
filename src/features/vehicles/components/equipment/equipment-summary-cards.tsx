import { VehicleStatsCard } from '@vehicles/components/common';
import type { VehicleEquipment } from '@vehicles/types';
import { formatPln } from '@vehicles/utils';
import { Banknote, Package } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type EquipmentSummaryCardsProps = {
  items: VehicleEquipment[];
};

export const EquipmentSummaryCards = ({ items }: EquipmentSummaryCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const { totalCost, totalCount } = useMemo(() => {
    const totalCost = items.reduce((acc, curr) => acc + (curr.costPln || 0), 0);
    return { totalCost, totalCount: items.length };
  }, [items]);

  return (
    <div
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4"
      data-testid="equipment-summary-cards"
    >
      <VehicleStatsCard
        title={t('equipmentPage.summary.totalSpending')}
        value={formatPln(totalCost, lang)}
        Icon={Banknote}
        iconClassName="text-emerald-500"
        data-testid="equipment-summary-cost"
      />

      <VehicleStatsCard
        title={t('equipmentPage.summary.totalItems')}
        value={String(totalCount)}
        Icon={Package}
        iconClassName="text-purple-500"
        data-testid="equipment-summary-count"
      />
    </div>
  );
};
