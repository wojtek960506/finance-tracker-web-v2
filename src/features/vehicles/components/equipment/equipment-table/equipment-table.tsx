import { VehicleTableShell } from '@vehicles/components/common';
import { useTranslation } from 'react-i18next';

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

  return (
    <VehicleTableShell
      isEmpty={items.length === 0}
      emptyState={
        <EquipmentEmptyState hasFilters={hasFilters} onAddFirstItem={onAddFirstItem} />
      }
      testId="equipment-entries-list"
      headers={
        <>
          <th className="px-3 py-2.5 font-medium">{t('equipmentPage.table.date')}</th>
          <th className="px-3 py-2.5 font-medium">{t('equipmentPage.table.itemName')}</th>
          <th className="px-3 py-2.5 font-medium">{t('equipmentPage.table.cost')}</th>
          <th className="px-3 py-2.5 font-medium">
            {t('equipmentPage.table.description')}
          </th>
          <th className="px-3 py-2.5 text-right font-medium">
            {t('equipmentPage.table.actions')}
          </th>
        </>
      }
      desktopRows={items.map((item) => (
        <EquipmentTableRow
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
      mobileCards={items.map((item) => (
        <EquipmentMobileCard
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
