import type { VehicleFuelSummary } from '@vehicles/api';
import { VehicleStatsCard } from '@vehicles/components/common';
import {
  formatConsumption,
  formatLiters,
  formatPln,
  formatUnitPrice,
} from '@vehicles/utils';
import { Banknote, Fuel, Gauge, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type FuelSummaryCardsProps = {
  summary?: VehicleFuelSummary;
};

export const FuelSummaryCards = ({ summary }: FuelSummaryCardsProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const totalVolume = summary?.totalVolume ?? 0;
  const totalCost = summary?.totalCostPln ?? 0;
  const avgConsumption = summary?.avgConsumptionLPer100Km ?? null;
  const avgUnitPrice = summary?.avgUnitPricePln ?? null;

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
