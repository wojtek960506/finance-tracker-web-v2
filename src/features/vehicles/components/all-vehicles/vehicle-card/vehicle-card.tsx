import type { VehicleWithSpending } from '@vehicles/api';
import { formatKm, formatPln } from '@vehicles/utils';
import clsx from 'clsx';
import { ChevronRight, Gauge, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button, Card, Dropdown } from '@shared/ui';

import { VehicleTypeBadge } from './vehicle-type-badge';

type VehicleCardProps = {
  vehicle: VehicleWithSpending;
  onEdit?: (vehicle: VehicleWithSpending) => void;
  onDelete?: (vehicle: VehicleWithSpending) => void;
};

export const VehicleCard = ({ vehicle, onEdit, onDelete }: VehicleCardProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  const targetSlug = vehicle.slug || vehicle.id;
  const brandModel = [vehicle.brand, vehicle.vehicleModel].filter(Boolean).join(' ');
  const subtitle = [brandModel, vehicle.productionYear].filter(Boolean).join(' • ');

  const { spending } = vehicle;
  const hasActions = Boolean(onEdit || onDelete);

  const dropdownItems = [
    ...(onEdit
      ? [
          {
            label: t('actions.edit'),
            icon: <Pencil className="size-3.5" />,
            onSelect: () => onEdit(vehicle),
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            label: t('actions.delete'),
            icon: <Trash2 className="size-3.5 text-destructive" />,
            className: clsx(
              'text-destructive hover:text-destructive',
              'hover:bg-destructive/10 dark:hover:bg-destructive/20',
            ),
            onSelect: () => onDelete(vehicle),
          },
        ]
      : []),
  ];

  return (
    <Card
      className={clsx(
        'group relative flex flex-col justify-between gap-3 p-4 transition-all',
        'hover:border-active-nav/40 hover:shadow-md',
      )}
      data-testid={`vehicle-card-${vehicle.id}`}
    >
      {/* Header: Title, Type Badge, Actions Menu, Subtitle */}
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={clsx(
              'truncate text-base font-bold text-fg sm:text-lg',
              'group-hover:text-active-nav',
            )}
          >
            {vehicle.name}
          </h3>
          <div className="flex items-center gap-1.5">
            <VehicleTypeBadge type={vehicle.type} />
            {hasActions && (
              <Dropdown
                trigger={
                  <Button
                    variant="ghost"
                    className="size-7 p-0 text-text-muted hover:text-fg"
                    aria-label={t('card.actionsMenu')}
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                }
                items={dropdownItems}
              />
            )}
          </div>
        </div>

        {subtitle && (
          <p className="truncate text-xs font-medium text-text-muted">{subtitle}</p>
        )}
      </div>

      {/* Main Metrics: Total Spent & Odometer */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-card-border/20 p-2.5">
        <div>
          <span className="text-[11px] font-medium text-text-muted">
            {t('card.totalSpent')}
          </span>
          <p className="text-sm font-bold text-fg sm:text-base">
            {formatPln(spending.totalSpentPln, lang)}
          </p>
        </div>

        <div>
          <span className="flex items-center gap-1 text-[11px] font-medium text-text-muted">
            <Gauge className="size-3" />
            {t('card.odometer')}
          </span>
          <p className="text-sm font-semibold text-fg sm:text-base">
            {formatKm(spending.lastOdometerKm, lang)}
          </p>
        </div>
      </div>

      {/* Spending Breakdown Quick Stats */}
      <div
        className={clsx(
          'flex items-center justify-between border-t border-border/60 pt-2',
          'text-xs text-text-muted',
        )}
      >
        <div className="flex items-center gap-3">
          <span>
            {t('card.fuel')}:{' '}
            <strong className="text-fg">{formatPln(spending.fuelTotalPln, lang)}</strong>
          </span>
          <span>
            {t('card.maintenance')}:{' '}
            <strong className="text-fg">
              {formatPln(spending.maintenanceTotalPln, lang)}
            </strong>
          </span>
        </div>

        <Link
          to={`/vehicles/${targetSlug}`}
          className="flex items-center gap-1 font-medium text-active-nav hover:underline"
          aria-label={`${t('card.viewDetails')} ${vehicle.name}`}
        >
          <span>{t('card.viewDetails')}</span>
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Card>
  );
};
