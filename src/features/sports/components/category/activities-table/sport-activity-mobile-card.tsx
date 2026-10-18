import clsx from 'clsx';
import { Dumbbell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { formatDate } from '../../../utils';

import { SportActivityItemActions } from './sport-activity-actions';
import { SportActivityCostRow } from './sport-activity-cost-cell';
import type { SportActivityMobileCardProps } from './types';

export const SportActivityMobileCard = ({
  item,
  onEdit,
  onDelete,
  onLink,
  onUnlink,
}: SportActivityMobileCardProps) => {
  const { i18n } = useTranslation('sports');
  const lang = i18n.language;

  return (
    <Card
      className={clsx(
        'flex flex-col gap-2.5 p-3.5',
        '[content-visibility:auto] [contain-intrinsic-size:0px_140px]',
      )}
      data-testid={`activity-card-${item.id}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={clsx(
              'flex size-7 shrink-0 items-center justify-center rounded-lg',
              'bg-blue-500/10 text-blue-500',
            )}
          >
            <Dumbbell className="size-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-fg truncate block">
              {item.itemName}
            </span>
            <span className="text-[11px] text-text-muted">
              {formatDate(item.date, lang)}
            </span>
          </div>
        </div>

        <SportActivityItemActions
          mode="dropdown"
          onEdit={onEdit}
          onDelete={onDelete}
          onLink={onLink}
          onUnlink={onUnlink}
        />
      </div>

      <SportActivityCostRow costPln={item.costPln} transactionId={item.transactionId} />
    </Card>
  );
};
