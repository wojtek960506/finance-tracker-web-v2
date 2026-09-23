import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export type PortfolioStatusFilter = 'all' | 'active' | 'closed';

type PortfolioStatusPillsProps = {
  selectedStatus: PortfolioStatusFilter;
  onSelectStatus: (status: PortfolioStatusFilter) => void;
  className?: string;
};

export const PortfolioStatusPills = ({
  selectedStatus,
  onSelectStatus,
  className,
}: PortfolioStatusPillsProps) => {
  const { t } = useTranslation('investments');

  return (
    <div className={clsx('flex flex-wrap items-center gap-1.5', className)}>
      <button
        type="button"
        className={clsx(
          'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
          selectedStatus === 'all'
            ? 'bg-bt-primary text-bt-primary-fg shadow-sm'
            : 'bg-muted/50 text-text-muted hover:bg-muted hover:text-foreground',
        )}
        onClick={() => onSelectStatus('all')}
      >
        {t('status.all')}
      </button>

      <button
        type="button"
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
          'font-semibold transition-colors',
          selectedStatus === 'active'
            ? clsx(
                'border-emerald-500/30 bg-emerald-500/20 text-emerald-700',
                'dark:text-emerald-300 shadow-sm',
              )
            : clsx(
                'border-emerald-500/20 bg-emerald-500/5 text-emerald-600/80',
                'hover:bg-emerald-500/15 dark:text-emerald-400',
              ),
        )}
        onClick={() => onSelectStatus('active')}
      >
        <span className="size-1.5 rounded-full bg-emerald-500" />
        <span>{t('status.active')}</span>
      </button>

      <button
        type="button"
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
          'font-semibold transition-colors',
          selectedStatus === 'closed'
            ? 'border-zinc-500/30 bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 shadow-sm'
            : clsx(
                'border-zinc-500/20 bg-zinc-500/5 text-zinc-600/80 hover:bg-zinc-500/15',
                'dark:text-zinc-400',
              ),
        )}
        onClick={() => onSelectStatus('closed')}
      >
        <span className="size-1.5 rounded-full bg-zinc-400" />
        <span>{t('status.closed')}</span>
      </button>
    </div>
  );
};
