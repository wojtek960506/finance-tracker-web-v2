import clsx from 'clsx';
import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export type SpendingTransactionBadgeProps = {
  transactionId?: string | null;
  onLink?: () => void;
  className?: string;
  size?: 'sm' | 'default';
};

export const SpendingTransactionBadge = ({
  transactionId,
  onLink,
  className,
  size = 'default',
}: SpendingTransactionBadgeProps) => {
  const { t } = useTranslation('vehicles');

  if (transactionId) {
    return (
      <Link
        to={`/transactions/${transactionId}`}
        className={clsx(
          'inline-flex items-center gap-1 rounded font-medium transition-colors',
          'bg-primary/10 text-primary hover:bg-primary/20',
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
          className,
        )}
        title={t('spendings.badge.viewTransaction')}
        data-testid="linked-transaction-badge"
      >
        <Link2 className={size === 'sm' ? 'size-2.5' : 'size-3'} />
        <span>{t('spendings.badge.linked')}</span>
      </Link>
    );
  }

  if (onLink) {
    return (
      <button
        type="button"
        onClick={onLink}
        className={clsx(
          'inline-flex items-center gap-1 rounded font-medium transition-colors',
          'border border-dashed border-border/80 bg-muted/40 text-text-muted',
          'hover:border-primary/50 hover:bg-muted/70 hover:text-fg',
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
          className,
        )}
        title={t('actions.linkTransaction')}
        data-testid="unlinked-transaction-badge"
      >
        <Link2 className={size === 'sm' ? 'size-2.5 opacity-60' : 'size-3 opacity-60'} />
        <span>{t('spendings.badge.unlinked')}</span>
      </button>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded text-text-muted opacity-60',
        size === 'sm' ? 'px-1 py-0.5 text-[10px]' : 'px-1.5 py-0.5 text-xs',
        className,
      )}
      data-testid="unlinked-transaction-badge"
    >
      <Link2 className={size === 'sm' ? 'size-2.5' : 'size-3'} />
      <span>{t('spendings.badge.unlinked')}</span>
    </span>
  );
};
