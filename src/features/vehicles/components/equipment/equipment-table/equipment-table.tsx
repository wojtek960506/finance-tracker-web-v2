import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';

import { EquipmentEmptyState } from './equipment-empty-state';
import { EquipmentMobileCard } from './equipment-mobile-card';
import { EquipmentTableRow } from './equipment-table-row';
import type { EquipmentTableProps } from './types';

export const EquipmentTable = ({
  items,
  hasFilters,
  onEditItem,
  onDeleteItem,
  onLinkItem,
  onUnlinkItem,
  onAddFirstItem,
}: EquipmentTableProps) => {
  const { t } = useTranslation('vehicles');

  if (items.length === 0) {
    return (
      <EquipmentEmptyState hasFilters={hasFilters} onAddFirstItem={onAddFirstItem} />
    );
  }

  return (
    <div className="flex flex-col gap-3" data-testid="equipment-entries-list">
      {/* Desktop table view */}
      <Card className="hidden overflow-hidden p-0 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-text-muted">
              <tr>
                <th className="px-3 py-2.5 font-medium">
                  {t('equipmentPage.table.date')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('equipmentPage.table.itemName')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('equipmentPage.table.cost')}
                </th>
                <th className="px-3 py-2.5 font-medium">
                  {t('equipmentPage.table.description')}
                </th>
                <th className="px-3 py-2.5 text-right font-medium">
                  {t('equipmentPage.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <EquipmentTableRow
                  key={item.id}
                  item={item}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item)}
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

      {/* Mobile card list */}
      <div className="flex flex-col gap-2.5 lg:hidden">
        {items.map((item) => (
          <EquipmentMobileCard
            key={item.id}
            item={item}
            onEdit={() => onEditItem(item)}
            onDelete={() => onDeleteItem(item)}
            onLink={
              !item.transactionId && onLinkItem ? () => onLinkItem(item) : undefined
            }
            onUnlink={
              item.transactionId && onUnlinkItem ? () => onUnlinkItem(item) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
