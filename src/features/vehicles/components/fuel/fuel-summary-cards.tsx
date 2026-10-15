import type { VehicleFuelEntryEnriched } from '@vehicles/api';
import { VehicleStatsCard } from '@vehicles/components/common';
import {
  formatConsumption,
  formatLiters,
  formatPln,
  formatUnitPrice,
} from '@vehicles/utils';
import { Banknote, Fuel, Gauge, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type FuelSummaryCardsProps = {
  entries: VehicleFuelEntryEnriched[];
};

export const FuelSummaryCards = ({ entries }: FuelSummaryCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const { totalVolume, totalCost, avgConsumption, avgUnitPrice } = useMemo(() => {
    const totalVolume = entries.reduce((acc, curr) => acc + (curr.fuelLiters || 0), 0);
    const totalCost = entries.reduce((acc, curr) => acc + (curr.costPln || 0), 0);

    const validConsumptions = entries
      .map((e) => e.consumptionLPer100Km)
      .filter((c): c is number => typeof c === 'number' && c > 0);
    const avgConsumption =
      validConsumptions.length > 0
        ? validConsumptions.reduce((a, b) => a + b, 0) / validConsumptions.length
        : null;

    const avgUnitPrice = totalVolume > 0 ? totalCost / totalVolume : null;

    return { totalVolume, totalCost, avgConsumption, avgUnitPrice };
  }, [entries]);

  return (
    <div
      className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4"
      data-testid="fuel-summary-cards"
    >
      <VehicleStatsCard
        title={t('fuelPage.summary.totalVolume')}
        value={formatLiters(totalVolume, lang)}
        Icon={Fuel}
        iconClassName="text-amber-500"
        data-testid="fuel-summary-volume"
      />

      <VehicleStatsCard
        title={t('fuelPage.summary.totalCost')}
        value={formatPln(totalCost, lang)}
        Icon={Banknote}
        iconClassName="text-emerald-500"
        data-testid="fuel-summary-cost"
      />

      <VehicleStatsCard
        title={t('fuelPage.summary.avgConsumption')}
        value={formatConsumption(avgConsumption, lang)}
        Icon={Gauge}
        iconClassName="text-sky-500"
        data-testid="fuel-summary-consumption"
      />

      <VehicleStatsCard
        title={t('fuelPage.summary.avgUnitPrice')}
        value={formatUnitPrice(avgUnitPrice, lang)}
        Icon={TrendingUp}
        iconClassName="text-indigo-500"
        data-testid="fuel-summary-unit-price"
      />
    </div>
  );
};
