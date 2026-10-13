import { formatDate, formatPln } from '@vehicles/utils';
import { useTranslation } from 'react-i18next';

import { VehicleItemActions } from '../../common';

import type { EquipmentTableRowProps } from './types';

export const EquipmentTableRow = ({ item, onEdit, onDelete }: EquipmentTableRowProps) => {
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
        {formatPln(item.costPln, lang)}
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        <span className="line-clamp-2 max-w-md">{item.description || '-'}</span>
      </td>

      <td className="px-3 py-3 text-right">
        <VehicleItemActions onEdit={onEdit} onDelete={onDelete} className="justify-end" />
      </td>
    </tr>
  );
};
