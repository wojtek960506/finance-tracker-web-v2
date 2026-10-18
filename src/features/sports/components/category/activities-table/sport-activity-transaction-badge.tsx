import clsx from 'clsx';
import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Badge } from '@shared/ui';

export interface SportActivityTransactionBadgeProps {
  transactionId?: string | null;
  className?: string;
  size?: 'sm' | 'default';
}

export const SportActivityTransactionBadge = ({
  transactionId,
  className,
  size = 'default',
}: SportActivityTransactionBadgeProps) => {
  const { t } = useTranslation('sports');

  if (transactionId) {
    return (
      <Badge
        variant="primary"
        size={size}
        asChild
        className={clsx('transition-colors', className)}
      >
        <Link
          to={`/transactions/${transactionId}`}
          title={t('spendings.linkTitle')}
          data-testid="linked-transaction-badge"
        >
          <Link2 />
          <span>{t('spendings.linked')}</span>
        </Link>
      </Badge>
    );
  }

  return (
    <Badge
      variant="warning"
      size={size}
      className={className}
      data-testid="unlinked-transaction-badge"
    >
      <Link2 />
      <span>{t('spendings.unlinked')}</span>
    </Badge>
  );
};
