import { VehicleItemActions } from '@vehicles/components/common';
import { SpendingCostRow } from '@vehicles/components/spendings';
import { formatDate, formatKm } from '@vehicles/utils';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { MaintenanceSectionBadge } from '../maintenance-section-badge';

import type { MaintenanceMobileCardProps } from './types';

export const MaintenanceMobileCard = ({
  item,
  onEdit,
  onDelete,
  onLink,
  onUnlink,
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

        <VehicleItemActions
          mode="dropdown"
          onEdit={onEdit}
          onDelete={onDelete}
          onLink={onLink}
          onUnlink={onUnlink}
        />
      </div>

      <SpendingCostRow
        label={t('maintenancePage.table.cost')}
        costPln={item.costPln}
        transactionId={item.transactionId}
      />

      <div className="grid grid-cols-2 gap-2 text-xs">
        {(item.serviceProvider || item.serviceAddress) && (
          <div className="flex flex-col">
            <span className="text-[11px] text-text-muted">
              {t('maintenancePage.table.serviceProvider')}
            </span>
            {item.serviceProvider && (
              <span className="font-medium text-fg">{item.serviceProvider}</span>
            )}
            {item.serviceAddress && (
              <span className="truncate text-[10px] text-text-muted">
                {item.serviceAddress}
              </span>
            )}
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
    </Card>
  );
};
