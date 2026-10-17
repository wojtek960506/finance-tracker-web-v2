import { VehicleTableShell } from '@vehicles/components/common';
import { useTranslation } from 'react-i18next';

import { FuelEmptyState } from './fuel-empty-state';
import { FuelMobileCard } from './fuel-mobile-card';
import { FuelTableRow } from './fuel-table-row';
import type { FuelTableProps } from './types';

export const FuelTable = ({
  entries,
  hasFilters,
  onEditEntry,
  onDeleteEntry,
  onLinkEntry,
  onUnlinkEntry,
  onAddFirstEntry,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  totalCount,
  loadedCount,
}: FuelTableProps) => {
  const { t } = useTranslation('vehicles');

  return (
    <VehicleTableShell
      isEmpty={entries.length === 0}
      emptyState={
        <FuelEmptyState hasFilters={hasFilters} onAddFirstEntry={onAddFirstEntry} />
      }
      testId="fuel-entries-list"
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      totalCount={totalCount}
      loadedCount={loadedCount}
      headers={
        <>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.date')}</th>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.odometer')}</th>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.distance')}</th>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.volume')}</th>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.unitPrice')}</th>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.cost')}</th>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.consumption')}</th>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.costPerKm')}</th>
          <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.station')}</th>
          <th className="px-3 py-2.5 text-right font-medium">
            {t('fuelPage.table.actions')}
          </th>
        </>
      }
      desktopRows={entries.map((entry) => (
        <FuelTableRow
          key={entry.id}
          entry={entry}
          onEdit={() => onEditEntry(entry)}
          onDelete={() => onDeleteEntry(entry)}
          onLink={
            !entry.transactionId && onLinkEntry ? () => onLinkEntry(entry) : undefined
          }
          onUnlink={
            entry.transactionId && onUnlinkEntry ? () => onUnlinkEntry(entry) : undefined
          }
        />
      ))}
      mobileCards={entries.map((entry) => (
        <FuelMobileCard
          key={entry.id}
          entry={entry}
          onEdit={() => onEditEntry(entry)}
          onDelete={() => onDeleteEntry(entry)}
          onLink={
            !entry.transactionId && onLinkEntry ? () => onLinkEntry(entry) : undefined
          }
          onUnlink={
            entry.transactionId && onUnlinkEntry ? () => onUnlinkEntry(entry) : undefined
          }
        />
      ))}
    />
  );
};
