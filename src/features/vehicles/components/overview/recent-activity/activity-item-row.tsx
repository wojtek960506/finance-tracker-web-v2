import type { VehicleOverviewActivityItem } from '@vehicles/api';
import {
  formatConsumption,
  formatDate,
  formatKm,
  formatLiters,
  formatPln,
} from '@vehicles/utils';
import clsx from 'clsx';
import { Fuel, Link2, Package, Wrench } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { ActivityItemRowProps } from './types';

const getActivityIconConfig = (
  type: VehicleOverviewActivityItem['type'],
): { icon: ReactNode; bgClass: string; textClass: string } => {
  switch (type) {
    case 'fuel':
      return {
        icon: <Fuel className="size-4" />,
        bgClass: 'bg-amber-500/10',
        textClass: 'text-amber-500',
      };
    case 'maintenance':
      return {
        icon: <Wrench className="size-4" />,
        bgClass: 'bg-blue-500/10',
        textClass: 'text-blue-500',
      };
    case 'equipment':
      return {
        icon: <Package className="size-4" />,
        bgClass: 'bg-emerald-500/10',
        textClass: 'text-emerald-500',
      };
  }
};

export const ActivityItemRow = ({ item }: ActivityItemRowProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const { icon, bgClass, textClass } = getActivityIconConfig(item.type);

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-3 p-3 transition-colors',
        'hover:bg-card-border/10',
      )}
      data-testid={`activity-row-${item.id}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={clsx(
            'flex size-8 shrink-0 items-center justify-center rounded-lg',
            bgClass,
            textClass,
          )}
        >
          {icon}
        </div>

        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="truncate text-xs font-semibold text-fg sm:text-sm">
              {item.title}
            </span>
            {item.type === 'fuel' && item.isFullTank !== undefined && (
              <span className="rounded bg-card-border/30 px-1.5 py-0.5 text-[10px] text-text-muted">
                {item.isFullTank
                  ? t('overview.activity.fullTank')
                  : t('overview.activity.partialTank')}
              </span>
            )}
          </div>

          <div
            className={clsx(
              'flex flex-wrap items-center gap-x-2 gap-y-0.5',
              'text-[11px] text-text-muted',
            )}
          >
            <span>{formatDate(item.date, lang)}</span>

            {typeof item.odometerKm === 'number' && (
              <>
                <span>•</span>
                <span>{formatKm(item.odometerKm, lang)}</span>
              </>
            )}

            {typeof item.fuelLiters === 'number' && (
              <>
                <span>•</span>
                <span>{formatLiters(item.fuelLiters, lang)}</span>
              </>
            )}

            {typeof item.consumptionLPer100Km === 'number' && (
              <>
                <span>•</span>
                <span>{formatConsumption(item.consumptionLPer100Km, lang)}</span>
              </>
            )}

            {item.maintenanceSection && (
              <>
                <span>•</span>
                <span>
                  {t(`overview.maintenanceSections.${item.maintenanceSection}`)}
                </span>
              </>
            )}

            {item.transactionId && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5 text-active-nav">
                  <Link2 className="size-2.5" />
                  {t('overview.activity.linkedTransaction')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="text-xs font-bold text-fg sm:text-sm">
          {formatPln(item.costPln, lang)}
        </span>
      </div>
    </div>
  );
};
