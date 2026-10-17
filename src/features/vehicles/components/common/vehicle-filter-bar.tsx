import clsx from 'clsx';
import { Filter, RotateCcw } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

export type VehicleFilterBarProps = {
  testId: string;
  toggleTestId: string;
  resetTestId?: string;
  resetLabel?: string;
  hasActiveFilters: boolean;
  onResetFilters?: () => void;
  actionButton: ReactNode;
  children: ReactNode;
};

export const VehicleFilterBar = ({
  testId,
  toggleTestId,
  resetTestId = 'filter-reset-button',
  resetLabel,
  hasActiveFilters,
  onResetFilters,
  actionButton,
  children,
}: VehicleFilterBarProps) => {
  const { t } = useTranslation('vehicles');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-2xl border border-border bg-modal-bg p-3 sm:p-3.5',
        'xl:flex-row xl:items-center xl:justify-between',
      )}
      data-testid={testId}
    >
      {/* Top Mobile Controls: Toggle on left, Action button on right */}
      <div className="flex items-center justify-between gap-2.5 xl:contents">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={clsx(
            'flex h-10 items-center gap-2 rounded-xl border px-3',
            'text-sm font-medium transition-colors',
            'sm:h-11 sm:px-3.5 xl:hidden',
            hasActiveFilters
              ? 'border-bt-primary/50 bg-bt-primary/10 text-bt-primary hover:bg-bt-primary/20'
              : 'border-border bg-card-bg text-text-muted hover:text-fg',
          )}
          aria-expanded={isExpanded}
          aria-label={t('actions.filterTitle')}
          data-testid={toggleTestId}
        >
          <Filter
            className={clsx(
              'size-5 shrink-0',
              hasActiveFilters ? 'text-bt-primary' : 'text-text-muted',
            )}
          />
          <span className="hidden sm:inline text-xs font-semibold sm:text-sm">
            {t('actions.filterTitle')}
          </span>
          {hasActiveFilters && <span className="size-2 rounded-full bg-bt-primary" />}
        </Button>

        {actionButton}
      </div>

      {/* Filter items: collapsible on mobile, always visible on desktop */}
      <div
        className={clsx(
          'w-full flex-col gap-3 border-t border-border/40 pt-3',
          'xl:w-auto xl:border-t-0 xl:pt-0 xl:flex-row xl:items-center xl:gap-3 xl:flex-wrap',
          'xl:order-first',
          isExpanded ? 'flex' : 'hidden xl:flex',
        )}
      >
        {children}

        {hasActiveFilters && onResetFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onResetFilters}
            className={clsx(
              'flex h-10 items-center gap-1.5 self-start px-2.5 text-xs text-text-muted',
              'hover:text-fg sm:h-11 xl:self-auto',
            )}
            data-testid={resetTestId}
          >
            <RotateCcw className="size-3.5 shrink-0" />
            <span>{resetLabel ?? t('actions.resetFilters')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
