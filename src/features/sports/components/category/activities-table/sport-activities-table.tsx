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
