import { VehicleItemActions } from '@vehicles/components/common';
import { formatDate, formatKm, formatPln } from '@vehicles/utils';
import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { MaintenanceSectionBadge } from './maintenance-section-badge';
import type { MaintenanceMobileCardProps } from './types';

export const MaintenanceMobileCard = ({
  item,
  onEdit,
  onDelete,
}: MaintenanceMobileCardProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <Card
      className="flex flex-col gap-2.5 p-3.5"
      data-testid={`maintenance-card-${item.id}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <MaintenanceSectionBadge section={item.section} />
          <span className="text-xs text-text-muted">• {formatDate(item.date, lang)}</span>
        </div>

        <VehicleItemActions onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className="flex items-baseline justify-between text-xs">
        <span className="text-text-muted">{t('maintenancePage.table.cost')}</span>
        <span className="text-sm font-bold text-fg">{formatPln(item.costPln, lang)}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {item.serviceProvider && (
          <div className="flex flex-col">
            <span className="text-[11px] text-text-muted">
              {t('maintenancePage.table.serviceProvider')}
            </span>
            <span className="font-medium text-fg">{item.serviceProvider}</span>
          </div>
        )}

        {typeof item.odometerKm === 'number' && (
          <div className="flex flex-col">
            <span className="text-[11px] text-text-muted">
              {t('maintenancePage.table.odometer')}
            </span>
            <span className="font-medium text-fg">{formatKm(item.odometerKm, lang)}</span>
          </div>
        )}
      </div>

      {item.description && (
        <p className="line-clamp-2 text-xs text-text-muted">{item.description}</p>
      )}

      {item.transactionId && (
        <div className="pt-1">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium text-active-nav"
            data-testid={`maintenance-mobile-linked-badge-${item.id}`}
          >
            <Link2 className="size-3" />
            {t('maintenancePage.table.linked')}
          </span>
        </div>
      )}
    </Card>
  );
};
