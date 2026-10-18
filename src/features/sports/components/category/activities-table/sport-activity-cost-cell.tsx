import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { formatPln } from '../../../utils';

import { SportActivityTransactionBadge } from './sport-activity-transaction-badge';

export interface SportActivityCostCellProps {
  costPln: number;
  transactionId?: string | null;
  className?: string;
  badgeSize?: 'sm' | 'default';
}

export const SportActivityCostCell = ({
  costPln,
  transactionId,
  className,
  badgeSize = 'sm',
}: SportActivityCostCellProps) => {
  const { i18n } = useTranslation('sports');
  const lang = i18n.language;

  return (
    <td className={clsx('px-3 py-3 text-xs font-bold text-fg sm:text-sm', className)}>
      <div className="flex flex-col items-start gap-1">
        <span>{formatPln(costPln, lang)}</span>
        <SportActivityTransactionBadge transactionId={transactionId} size={badgeSize} />
      </div>
    </td>
  );
};

export interface SportActivityCostDisplayProps {
  costPln: number;
  transactionId?: string | null;
  className?: string;
  badgeSize?: 'sm' | 'default';
}

export const SportActivityCostDisplay = ({
  costPln,
  transactionId,
  className,
  badgeSize = 'sm',
}: SportActivityCostDisplayProps) => {
  const { i18n } = useTranslation('sports');
  const lang = i18n.language;

  return (
    <div className={clsx('flex items-center gap-1.5', className)}>
      <span className="text-sm font-bold text-fg">{formatPln(costPln, lang)}</span>
      <SportActivityTransactionBadge transactionId={transactionId} size={badgeSize} />
    </div>
  );
};

export interface SportActivityCostRowProps {
  costPln: number;
  transactionId?: string | null;
  className?: string;
  badgeSize?: 'sm' | 'default';
}

export const SportActivityCostRow = ({
  costPln,
  transactionId,
  className,
  badgeSize = 'sm',
}: SportActivityCostRowProps) => {
  const { i18n } = useTranslation('sports');
  const lang = i18n.language;

  return (
    <div className={clsx('flex items-center justify-between gap-2', className)}>
      <span className="text-sm font-bold text-fg">{formatPln(costPln, lang)}</span>
      <SportActivityTransactionBadge transactionId={transactionId} size={badgeSize} />
    </div>
  );
};
