import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { SportActivitiesEmptyState } from './sport-activities-empty-state';
import { SportActivitiesPagination } from './sport-activities-pagination';
import { SportActivityMobileCard } from './sport-activity-mobile-card';
import { SportActivityTableRow } from './sport-activity-table-row';
import type { SportActivitiesTableProps } from './types';

export const SportActivitiesTable = ({
  items,
  hasFilters,
  isLoading,
  onEditItem,
  onDeleteItem,
  onLinkItem,
  onUnlinkItem,
  onAddFirstItem,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  totalCount,
  loadedCount,
  'data-testid': testId = 'sport-activities-table',
}: SportActivitiesTableProps) => {
  const { t } = useTranslation('sports');

  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-col gap-3" data-testid={`${testId}-loading`}>
        {/* Desktop Skeleton View */}
        <Card className="hidden overflow-hidden p-0 lg:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-text-muted">
                <tr>
                  <th className="px-3 py-2.5 font-medium">{t('entries.date')}</th>
                  <th className="px-3 py-2.5 font-medium">{t('entries.itemName')}</th>
                  <th className="px-3 py-2.5 font-medium">{t('entries.cost')}</th>
                  <th className="px-3 py-2.5 text-right font-medium">
                    {t('entries.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[0, 1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-3">
                      <div className="h-4 w-20 rounded bg-card-border/30" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-4 w-44 rounded bg-card-border/40" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="h-4 w-16 rounded bg-card-border/30" />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="ml-auto h-4 w-12 rounded bg-card-border/30" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mobile Skeleton Card View */}
        <div className="flex flex-col gap-2.5 lg:hidden">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="flex flex-col gap-2.5 p-3.5 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-card-border/40" />
                <div className="h-4 w-16 rounded bg-card-border/30" />
              </div>
              <div className="h-4 w-32 rounded bg-card-border/30" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div data-testid="sport-category-empty-state" className="w-full">
        <SportActivitiesEmptyState
          hasFilters={hasFilters}
          onAddFirstItem={onAddFirstItem}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" data-testid={testId}>
      {/* Desktop Table View */}
      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-text-muted">
              <tr>
                <th className="px-3 py-2.5 font-medium">{t('entries.date')}</th>
                <th className="px-3 py-2.5 font-medium">{t('entries.itemName')}</th>
                <th className="px-3 py-2.5 font-medium">{t('entries.cost')}</th>
                <th className="px-3 py-2.5 text-right font-medium">
                  {t('entries.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <SportActivityTableRow
                  key={item.id}
                  item={item}
                  onEdit={onEditItem ? () => onEditItem(item) : undefined}
                  onDelete={onDeleteItem ? () => onDeleteItem(item) : undefined}
                  onLink={
                    !item.transactionId && onLinkItem ? () => onLinkItem(item) : undefined
                  }
                  onUnlink={
                    item.transactionId && onUnlinkItem
                      ? () => onUnlinkItem(item)
                      : undefined
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card List View */}
      <div className="flex flex-col gap-2.5 lg:hidden">
        {items.map((item) => (
          <SportActivityMobileCard
            key={item.id}
            item={item}
            onEdit={onEditItem ? () => onEditItem(item) : undefined}
            onDelete={onDeleteItem ? () => onDeleteItem(item) : undefined}
            onLink={
              !item.transactionId && onLinkItem ? () => onLinkItem(item) : undefined
            }
            onUnlink={
              item.transactionId && onUnlinkItem ? () => onUnlinkItem(item) : undefined
            }
          />
        ))}
      </div>

      {/* Pagination Footer */}
      <SportActivitiesPagination
        testId={testId}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        totalCount={totalCount}
        loadedCount={loadedCount}
      />
    </div>
  );
};
