import { VehicleItemActions } from '@vehicles/components/common';
import { SpendingCostRow } from '@vehicles/components/spendings';
import { formatDate } from '@vehicles/utils';
import clsx from 'clsx';
import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import type { EquipmentMobileCardProps } from './types';

export const EquipmentMobileCard = ({
  item,
  onEdit,
  onDelete,
  onLink,
  onUnlink,
}: EquipmentMobileCardProps) => {
  const { t, i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <Card
      className={clsx(
        'flex flex-col gap-2.5 p-3.5',
        '[content-visibility:auto] [contain-intrinsic-size:0px_140px]',
      )}
      data-testid={`equipment-card-${item.id}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              'flex size-7 items-center justify-center rounded-lg',
              'bg-purple-500/10 text-purple-500',
            )}
          >
            <Package className="size-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-fg">{item.itemName}</span>
            <span className="ml-1.5 text-xs text-text-muted">
              • {formatDate(item.date, lang)}
            </span>
          </div>
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
        label={t('equipmentPage.table.cost')}
        costPln={item.costPln}
        transactionId={item.transactionId}
      />

      {item.description && (
        <p className="line-clamp-2 text-xs text-text-muted">{item.description}</p>
      )}
    </Card>
  );
};
