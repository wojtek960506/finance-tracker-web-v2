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
import { Pencil, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

import type { FuelTableRowProps } from './types';

export const FuelTableRow = ({ entry, onEdit, onDelete }: FuelTableRowProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <tr
      className="border-b border-border transition-colors hover:bg-muted/40 last:border-b-0"
      data-testid={`fuel-row-${entry.id}`}
    >
      <td className="px-3 py-3 text-xs font-medium text-fg sm:text-sm">
        {formatDate(entry.date, lang)}
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        {formatKm(entry.odometerKm, lang)}
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        {formatDeltaKm(entry.distanceSincePreviousKm, lang)}
      </td>

      <td className="px-3 py-3 text-xs font-medium text-fg">
        <div className="flex items-center gap-1.5">
          <span>{formatLiters(entry.fuelLiters, lang)}</span>
          {entry.isFullTank && (
            <span
              className={clsx(
                'rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px]',
                'font-semibold text-amber-500',
              )}
            >
              Full
            </span>
          )}
        </div>
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        {formatUnitPrice(entry.unitPricePln, lang)}
      </td>

      <td className="px-3 py-3 text-xs font-bold text-fg sm:text-sm">
        {formatPln(entry.costPln, lang)}
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        {entry.consumptionLPer100Km ? (
          <span
            className={clsx(
              'rounded-lg bg-sky-500/10 px-2 py-0.5 text-[11px]',
              'font-semibold text-sky-500',
            )}
          >
            {formatConsumption(entry.consumptionLPer100Km, lang)}
          </span>
        ) : (
          '-'
        )}
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        {formatCostPerKm(entry.costPerKmPln, lang)}
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        <div className="flex flex-col">
          <span className="font-medium text-fg">{entry.stationBrand || '-'}</span>
          {entry.stationAddress && (
            <span className="truncate text-[10px] text-text-muted max-w-[12rem]">
              {entry.stationAddress}
            </span>
          )}
        </div>
      </td>

      <td className="px-3 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={onEdit}
            title={t('actions.edit')}
            aria-label={t('actions.edit')}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onDelete}
            title={t('actions.delete')}
            aria-label={t('actions.delete')}
          >
            <Trash />
          </Button>
        </div>
      </td>
    </tr>
  );
};
