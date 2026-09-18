import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

type InstrumentStatusBadgeProps = {
  isClosed: boolean;
  className?: string;
};

export const InstrumentStatusBadge = ({
  isClosed,
  className,
}: InstrumentStatusBadgeProps) => {
  const { t } = useTranslation('investments');

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border',
        'px-2 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        !isClosed
          ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-fg/10 bg-fg/5 text-text-muted',
        className,
      )}
      data-testid="instrument-status-badge"
    >
      <span
        className={clsx(
          'size-1.5 rounded-full',
          !isClosed ? 'bg-emerald-500 shadow-sm' : 'bg-text-muted/60',
        )}
      />
      <span>{!isClosed ? t('status.active') : t('status.closed')}</span>
    </span>
  );
};
