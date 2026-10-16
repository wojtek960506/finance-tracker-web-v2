import { formatPln } from '@vehicles/utils';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { SpendingTransactionBadge } from './spending-transaction-badge';

export type SpendingCostCellProps = {
  costPln: number;
  transactionId?: string | null;
  className?: string;
  badgeSize?: 'sm' | 'default';
};

export const SpendingCostCell = ({
  costPln,
  transactionId,
  className,
  badgeSize = 'sm',
}: SpendingCostCellProps) => {
  const { i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <td className={clsx('px-3 py-3 text-xs font-bold text-fg sm:text-sm', className)}>
      <div className="flex flex-col items-start gap-1">
        <span>{formatPln(costPln, lang)}</span>
        <SpendingTransactionBadge transactionId={transactionId} size={badgeSize} />
      </div>
    </td>
  );
};

export type SpendingCostDisplayProps = {
  costPln: number;
  transactionId?: string | null;
  className?: string;
  badgeSize?: 'sm' | 'default';
};

export const SpendingCostDisplay = ({
  costPln,
  transactionId,
  className,
  badgeSize = 'sm',
}: SpendingCostDisplayProps) => {
  const { i18n } = useTranslation('vehicles');
  const lang = i18n.language;

  return (
    <div className={clsx('flex items-center gap-1.5', className)}>
      <span className="text-sm font-bold text-fg">{formatPln(costPln, lang)}</span>
      <SpendingTransactionBadge transactionId={transactionId} size={badgeSize} />
    </div>
  );
};

export type SpendingCostRowProps = {
  costPln: number;
  transactionId?: string | null;
  label: string;
  className?: string;
  badgeSize?: 'sm' | 'default';
};

export const SpendingCostRow = ({
  costPln,
  transactionId,
  label,
  className,
  badgeSize = 'sm',
}: SpendingCostRowProps) => {
  return (
    <div className={clsx('flex items-baseline justify-between text-xs', className)}>
      <span className="text-text-muted">{label}</span>
      <SpendingCostDisplay
        costPln={costPln}
        transactionId={transactionId}
        badgeSize={badgeSize}
      />
    </div>
  );
};
