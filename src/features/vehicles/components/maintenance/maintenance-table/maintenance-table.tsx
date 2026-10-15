import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { MaintenanceEmptyState } from './maintenance-empty-state';
import { MaintenanceMobileCard } from './maintenance-mobile-card';
import { MaintenanceTableRow } from './maintenance-table-row';
import type { MaintenanceTableProps } from './types';

export const MaintenanceTable = ({
  items,
  hasFilters,
  onEditItem,
  onDeleteItem,
  onAddFirstItem,
}: MaintenanceTableProps) => {
  const { t } = useTranslation('vehicles');

  if (items.length === 0) {
    return (
      <MaintenanceEmptyState hasFilters={hasFilters} onAddFirstItem={onAddFirstItem} />
    );
  }

  return (
    <Card
      className="overflow-hidden p-0 shadow-none border border-border bg-card-bg"
      data-testid="maintenance-table-card"
    >
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="border-b border-border bg-muted/40 text-text-muted">
            <tr>
              <th className="px-3 py-2.5 font-medium">
                {t('maintenancePage.table.date')}
              </th>
              <th className="px-3 py-2.5 font-medium">
                {t('maintenancePage.table.serviceProvider')}
              </th>
              <th className="px-3 py-2.5 font-medium">
                {t('maintenancePage.table.odometer')}
              </th>
              <th className="px-3 py-2.5 font-medium">
                {t('maintenancePage.table.cost')}
              </th>
              <th className="px-3 py-2.5 font-medium">
                {t('maintenancePage.table.description')}
              </th>
              <th className="px-3 py-2.5 font-medium">
                {t('maintenancePage.table.linked')}
              </th>
              <th className="px-3 py-2.5 text-right font-medium">
                {t('maintenancePage.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <MaintenanceTableRow
                key={item.id}
                item={item}
                onEdit={() => onEditItem(item)}
                onDelete={() => onDeleteItem(item)}
                showSectionBadge={false}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="flex flex-col gap-2.5 p-3 lg:hidden">
        {items.map((item) => (
          <MaintenanceMobileCard
            key={item.id}
            item={item}
            onEdit={() => onEditItem(item)}
            onDelete={() => onDeleteItem(item)}
          />
        ))}
      </div>
    </Card>
  );
};
