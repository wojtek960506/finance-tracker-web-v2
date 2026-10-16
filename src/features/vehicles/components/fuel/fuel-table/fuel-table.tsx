import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

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
}: FuelTableProps) => {
  const { t } = useTranslation('vehicles');

  if (entries.length === 0) {
    return <FuelEmptyState hasFilters={hasFilters} onAddFirstEntry={onAddFirstEntry} />;
  }

  return (
    <div className="flex flex-col gap-3" data-testid="fuel-entries-list">
      {/* Desktop table view */}
      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-text-muted">
              <tr>
                <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.date')}</th>
                <th className="px-3 py-2.5 font-medium">
                  {t('fuelPage.table.odometer')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('fuelPage.table.distance')}
                </th>
                <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.volume')}</th>
                <th className="px-3 py-2.5 font-medium">
                  {t('fuelPage.table.unitPrice')}
                </th>
                <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.cost')}</th>
                <th className="px-3 py-2.5 font-medium">
                  {t('fuelPage.table.consumption')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('fuelPage.table.costPerKm')}
                </th>
                <th className="px-3 py-2.5 font-medium">{t('fuelPage.table.station')}</th>
                <th className="px-3 py-2.5 text-right font-medium">
                  {t('fuelPage.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.map((entry) => (
                <FuelTableRow
                  key={entry.id}
                  entry={entry}
                  onEdit={() => onEditEntry(entry)}
                  onDelete={() => onDeleteEntry(entry)}
                  onLink={
                    !entry.transactionId && onLinkEntry
                      ? () => onLinkEntry(entry)
                      : undefined
                  }
                  onUnlink={
                    entry.transactionId && onUnlinkEntry
                      ? () => onUnlinkEntry(entry)
                      : undefined
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="flex flex-col gap-2.5 lg:hidden">
        {entries.map((entry) => (
          <FuelMobileCard
            key={entry.id}
            entry={entry}
            onEdit={() => onEditEntry(entry)}
            onDelete={() => onDeleteEntry(entry)}
            onLink={
              !entry.transactionId && onLinkEntry ? () => onLinkEntry(entry) : undefined
            }
            onUnlink={
              entry.transactionId && onUnlinkEntry
                ? () => onUnlinkEntry(entry)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
