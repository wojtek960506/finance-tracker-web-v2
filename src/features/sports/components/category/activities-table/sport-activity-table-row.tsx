import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { formatDate } from '../../../utils';

import { SportActivityItemActions } from './sport-activity-actions';
import { SportActivityCostCell } from './sport-activity-cost-cell';
import type { SportActivityTableRowProps } from './types';

export const SportActivityTableRow = ({
  item,
  onEdit,
  onDelete,
  onLink,
  onUnlink,
}: SportActivityTableRowProps) => {
  const { i18n } = useTranslation('sports');
  const lang = i18n.language;

  return (
    <tr
      className={clsx(
        'border-b border-border transition-colors hover:bg-muted/40 last:border-b-0',
        '[content-visibility:auto] [contain-intrinsic-size:0px_45px]',
      )}
      data-testid={`activity-row-${item.id}`}
    >
      <td className="px-3 py-3 text-xs font-medium text-fg sm:text-sm">
        {formatDate(item.date, lang)}
      </td>

      <td className="px-3 py-3 text-xs font-semibold text-fg sm:text-sm">
        {item.itemName}
      </td>

      <SportActivityCostCell costPln={item.costPln} transactionId={item.transactionId} />

      <td className="px-3 py-3 text-right">
        <SportActivityItemActions
          onEdit={onEdit}
          onDelete={onDelete}
          onLink={onLink}
          onUnlink={onUnlink}
          className="justify-end"
          editTestId={`edit-activity-${item.id}`}
          deleteTestId={`delete-activity-${item.id}`}
          linkTestId={`link-activity-${item.id}`}
          unlinkTestId={`unlink-activity-${item.id}`}
        />
      </td>
    </tr>
  );
};
