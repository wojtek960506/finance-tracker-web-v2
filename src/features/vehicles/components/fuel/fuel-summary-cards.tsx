import type { VehicleFuelSummary } from '@vehicles/api';
import { VehicleStatsCard } from '@vehicles/components/common';
import {
  FUEL_METRICS_CONFIG,
  SPENDING_TYPE_CONFIG,
  TOTAL_SPENDING_CONFIG,
} from '@vehicles/consts';
import {
  formatConsumption,
  formatLiters,
  formatPln,
  formatUnitPrice,
} from '@vehicles/utils';
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
        Icon={SPENDING_TYPE_CONFIG.fuel.icon}
        iconClassName={SPENDING_TYPE_CONFIG.fuel.colorClass}
        data-testid="fuel-summary-volume"
      />

      <VehicleStatsCard
        title={t('fuelPage.summary.totalCost')}
        value={formatPln(totalCost, lang)}
        Icon={TOTAL_SPENDING_CONFIG.icon}
        iconClassName={TOTAL_SPENDING_CONFIG.colorClass}
        data-testid="fuel-summary-cost"
      />

      <VehicleStatsCard
        title={t('fuelPage.summary.avgConsumption')}
        value={formatConsumption(avgConsumption, lang)}
        Icon={FUEL_METRICS_CONFIG.avgConsumption.icon}
        iconClassName={FUEL_METRICS_CONFIG.avgConsumption.colorClass}
        data-testid="fuel-summary-consumption"
      />

      <VehicleStatsCard
        title={t('fuelPage.summary.avgUnitPrice')}
        value={formatUnitPrice(avgUnitPrice, lang)}
        Icon={FUEL_METRICS_CONFIG.avgUnitPrice.icon}
        iconClassName={FUEL_METRICS_CONFIG.avgUnitPrice.colorClass}
        data-testid="fuel-summary-unit-price"
      />
    </div>
  );
};
