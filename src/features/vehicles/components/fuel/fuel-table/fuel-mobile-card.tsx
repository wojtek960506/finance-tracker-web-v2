import {
  formatConsumption,
  formatCostPerKm,
  formatDate,
  formatDeltaKm,
  formatKm,
  formatLiters,
  formatPln,
  formatUnitPrice,
} from '@vehicles/utils';
import clsx from 'clsx';
import { Fuel } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { VehicleItemActions } from '../../common';

import type { FuelMobileCardProps } from './types';

export const FuelMobileCard = ({ entry, onEdit, onDelete }: FuelMobileCardProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <Card className="flex flex-col gap-2.5 p-3.5" data-testid={`fuel-card-${entry.id}`}>
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Fuel className="size-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-fg">
              {formatDate(entry.date, lang)}
            </span>
            {entry.stationBrand && (
              <span className="ml-1.5 text-xs text-text-muted">
                • {entry.stationBrand}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {entry.isFullTank && (
            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
              Full
            </span>
          )}
          <VehicleItemActions mode="dropdown" onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col">
          <span className="text-[11px] text-text-muted">{t('fuelPage.table.cost')}</span>
          <span className="text-sm font-bold text-fg">
            {formatPln(entry.costPln, lang)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-text-muted">
            {t('fuelPage.table.volume')}
          </span>
          <span className="font-medium text-fg">
            {formatLiters(entry.fuelLiters, lang)} (
            {formatUnitPrice(entry.unitPricePln, lang)})
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-text-muted">
            {t('fuelPage.table.odometer')}
          </span>
          <span className="font-medium text-fg">
            {formatKm(entry.odometerKm, lang)}{' '}
            {entry.distanceSincePreviousKm && (
              <span className="text-text-muted">
                ({formatDeltaKm(entry.distanceSincePreviousKm, lang)})
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-text-muted">
            {t('fuelPage.table.consumption')}
          </span>
          <span className="font-medium text-fg">
            {entry.consumptionLPer100Km ? (
              <span
                className={clsx(
                  'rounded bg-sky-500/10 px-1.5 py-0.5 text-[11px]',
                  'font-semibold text-sky-500',
                )}
              >
                {formatConsumption(entry.consumptionLPer100Km, lang)}
              </span>
            ) : (
              formatCostPerKm(entry.costPerKmPln, lang)
            )}
          </span>
        </div>
      </div>
    </Card>
  );
};
