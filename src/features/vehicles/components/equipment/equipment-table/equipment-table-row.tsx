import { VehicleItemActions } from '@vehicles/components/common';
import { SpendingTransactionBadge } from '@vehicles/components/spendings';
import { formatDate, formatPln } from '@vehicles/utils';
import { useTranslation } from 'react-i18next';

import type { EquipmentTableRowProps } from './types';

export const EquipmentTableRow = ({
  item,
  onEdit,
  onDelete,
  onLink,
  onUnlink,
}: EquipmentTableRowProps) => {
  const { i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <tr
      className="border-b border-border transition-colors hover:bg-muted/40 last:border-b-0"
      data-testid={`equipment-row-${item.id}`}
    >
      <td className="px-3 py-3 text-xs font-medium text-fg sm:text-sm">
        {formatDate(item.date, lang)}
      </td>

      <td className="px-3 py-3 text-xs font-semibold text-fg sm:text-sm">
        {item.itemName}
      </td>

      <td className="px-3 py-3 text-xs font-bold text-fg sm:text-sm">
        <div className="flex flex-col items-start gap-1">
          <span>{formatPln(item.costPln, lang)}</span>
          <SpendingTransactionBadge transactionId={item.transactionId} size="sm" />
        </div>
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        <span className="line-clamp-2 max-w-md">{item.description || '-'}</span>
      </td>

      <td className="px-3 py-3 text-right">
        <VehicleItemActions
          onEdit={onEdit}
          onDelete={onDelete}
          onLink={onLink}
          onUnlink={onUnlink}
          className="justify-end"
        />
      </td>
    </tr>
  );
};
