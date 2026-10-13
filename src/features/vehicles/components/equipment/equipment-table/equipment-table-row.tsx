import { formatDate, formatPln } from '@vehicles/utils';
import { Pencil, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

import type { EquipmentTableRowProps } from './types';

export const EquipmentTableRow = ({ item, onEdit, onDelete }: EquipmentTableRowProps) => {
  const { t, i18n } = useTranslation('vehicles');
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
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={onEdit}
            title={t('actions.edit')}
            aria-label={t('actions.edit')}
          >
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onDelete}
            title={t('actions.delete')}
            aria-label={t('actions.delete')}
          >
            <Trash />
          </Button>
        </div>
      </td>
    </tr>
  );
};
