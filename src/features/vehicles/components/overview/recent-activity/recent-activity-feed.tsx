import clsx from 'clsx';
import { History, Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { ActivityItemRow } from './activity-item-row';
import type { RecentActivityFeedProps } from './types';

export const RecentActivityFeed = ({ items }: RecentActivityFeedProps) => {
  const { t } = useTranslation('vehicles');

  const hasItems = items.length > 0;

  return (
    <Card className="flex flex-col gap-3 p-4" data-testid="recent-activity-feed">
      <div className="flex items-center justify-between gap-2 border-b border-card-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              'flex size-7 items-center justify-center rounded-lg',
              'bg-card-border/30 text-fg',
            )}
          >
            <History className="size-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-fg sm:text-base">
              {t('overview.activity.title')}
            </h2>
            <p className="text-[11px] text-text-muted">
              {t('overview.activity.subtitle')}
            </p>
          </div>
        </div>

        {hasItems && (
          <span className="rounded-md bg-card-border/20 px-2 py-0.5 text-xs text-text-muted">
            {items.length} {t('card.entriesCount').toLowerCase()}
          </span>
        )}
      </div>

      {!hasItems && (
        <div
          className="flex flex-col items-center justify-center py-8 text-center"
          data-testid="activity-empty-state"
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-card-border/20 text-text-muted">
            <Inbox className="size-5" />
          </div>
          <p className="mt-2 text-xs font-semibold text-fg sm:text-sm">
            {t('overview.activity.emptyTitle')}
          </p>
          <p className="mt-1 max-w-sm text-xs text-text-muted">
            {t('overview.activity.emptyDescription')}
          </p>
        </div>
      )}

      {hasItems && (
        <div className="flex flex-col divide-y divide-card-border/20 overflow-hidden rounded-xl border border-card-border/30">
          {items.map((item) => (
            <ActivityItemRow key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </Card>
  );
};
