import clsx from 'clsx';
import { Filter, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui/button';

import type { FilterBarProps } from './types';

export const FilterBar = ({
  testId = 'filter-bar',
  toggleTestId = 'filter-toggle-button',
  resetTestId = 'filter-reset-button',
  containerTestId = 'filter-bar-container',
  filterLabel,
  resetLabel,
  hasActiveFilters,
  onResetFilters,
  actionButton,
  children,
  className,
}: FilterBarProps) => {
  const { t } = useTranslation('common');
  const [isExpanded, setIsExpanded] = useState(false);

  const resolvedFilterLabel = filterLabel ?? t('filters');
  const resolvedResetLabel = resetLabel ?? t('resetFilters');

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-2xl border border-border bg-modal-bg p-3 sm:p-3.5',
        'xl:flex-row xl:items-center xl:justify-between',
        className,
      )}
      data-testid={testId}
    >
      {/* Mobile Top Controls: Filter Toggle + Action Button */}
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
          aria-label={resolvedFilterLabel}
          data-testid={toggleTestId}
        >
          <Filter
            className={clsx(
              'size-4 shrink-0',
              hasActiveFilters ? 'text-bt-primary' : 'text-text-muted',
            )}
          />
          <span className="text-xs font-semibold sm:text-sm">{resolvedFilterLabel}</span>
          {hasActiveFilters && <span className="size-2 rounded-full bg-bt-primary" />}
        </Button>

        {actionButton}
      </div>

      {/* Filter inputs container */}
      <div
        className={clsx(
          'w-full flex-col gap-2.5 border-t border-border/40 pt-2.5',
          'xl:w-auto xl:border-t-0 xl:pt-0 xl:flex-row xl:items-center xl:gap-3 xl:flex-wrap',
          'xl:order-first',
          isExpanded ? 'flex' : 'hidden xl:flex',
        )}
        data-testid={containerTestId}
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
            <span>{resolvedResetLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
