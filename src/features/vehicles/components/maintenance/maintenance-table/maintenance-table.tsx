import { VehicleTableShell } from '@vehicles/components/common';
import { useTranslation } from 'react-i18next';

import { MaintenanceEmptyState } from './maintenance-empty-state';
import { MaintenanceMobileCard } from './maintenance-mobile-card';
import { MaintenanceTableRow } from './maintenance-table-row';
import type { MaintenanceTableProps } from './types';

export const MaintenanceTable = ({
  activeSection,
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
}: MaintenanceTableProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <VehicleTableShell
      isEmpty={items.length === 0}
      emptyState={
        <MaintenanceEmptyState
          activeSection={activeSection}
          hasFilters={hasFilters}
          onAddFirstItem={onAddFirstItem}
        />
      }
      testId="maintenance-entries-list"
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      totalCount={totalCount}
      loadedCount={loadedCount}
      headers={
        <>
          <th className="px-3 py-2.5 font-medium">{t('maintenancePage.table.date')}</th>
          <th className="px-3 py-2.5 font-medium">
            {t('maintenancePage.table.serviceProvider')}
          </th>
          <th className="px-3 py-2.5 font-medium">
            {t('maintenancePage.table.odometer')}
          </th>
          <th className="px-3 py-2.5 font-medium">{t('maintenancePage.table.cost')}</th>
          <th className="px-3 py-2.5 font-medium">
            {t('maintenancePage.table.description')}
          </th>
          <th className="px-3 py-2.5 text-right font-medium">
            {t('maintenancePage.table.actions')}
          </th>
        </>
      }
      desktopRows={items.map((item) => (
        <MaintenanceTableRow
          key={item.id}
          item={item}
          onEdit={() => onEditItem(item)}
          onDelete={() => onDeleteItem(item)}
          onLink={!item.transactionId && onLinkItem ? () => onLinkItem(item) : undefined}
          onUnlink={
            item.transactionId && onUnlinkItem ? () => onUnlinkItem(item) : undefined
          }
          showSectionBadge={false}
        />
      ))}
      mobileCards={items.map((item) => (
        <MaintenanceMobileCard
          key={item.id}
          item={item}
          onEdit={() => onEditItem(item)}
          onDelete={() => onDeleteItem(item)}
          onLink={!item.transactionId && onLinkItem ? () => onLinkItem(item) : undefined}
          onUnlink={
            item.transactionId && onUnlinkItem ? () => onUnlinkItem(item) : undefined
          }
        />
      ))}
    />
  );
};
