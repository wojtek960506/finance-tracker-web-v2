import { VehicleItemActions } from '@vehicles/components/common';
import { SpendingTransactionBadge } from '@vehicles/components/spendings';
import { formatDate, formatKm, formatPln } from '@vehicles/utils';
import { useTranslation } from 'react-i18next';

import { MaintenanceSectionBadge } from '../maintenance-section-badge';

import type { MaintenanceTableRowProps } from './types';

export const MaintenanceTableRow = ({
  item,
  onEdit,
  onDelete,
  onLink,
  onUnlink,
  showSectionBadge = true,
}: MaintenanceTableRowProps) => {
  const { i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <tr
      className="border-b border-border transition-colors hover:bg-muted/40 last:border-b-0"
      data-testid={`maintenance-row-${item.id}`}
    >
      <td className="px-3 py-3 text-xs font-medium text-fg sm:text-sm">
        {formatDate(item.date, lang)}
      </td>

      {showSectionBadge && (
        <td className="px-3 py-3 text-xs">
          <MaintenanceSectionBadge section={item.section} />
        </td>
      )}

      <td className="px-3 py-3 text-xs text-text-muted">
        <div className="flex flex-col">
          <span className="font-medium text-fg">{item.serviceProvider || '-'}</span>
          {item.serviceAddress && (
            <span className="truncate text-[10px] text-text-muted max-w-[12rem]">
              {item.serviceAddress}
            </span>
          )}
        </div>
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        {typeof item.odometerKm === 'number' ? formatKm(item.odometerKm, lang) : '-'}
      </td>

      <td className="px-3 py-3 text-xs font-bold text-fg sm:text-sm">
        <div className="flex flex-col items-start gap-1">
          <span>{formatPln(item.costPln, lang)}</span>
          <SpendingTransactionBadge transactionId={item.transactionId} size="sm" />
        </div>
      </td>

      <td className="px-3 py-3 text-xs text-text-muted">
        <span className="line-clamp-2 max-w-xs">{item.description || '-'}</span>
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
