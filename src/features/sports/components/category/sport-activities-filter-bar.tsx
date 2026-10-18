import clsx from 'clsx';
import { Filter, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonWithIcon, DateInput, SearchFilterInput } from '@shared/ui';

import type { SportEntrySortOption } from '../../api';
import { SPORTS_SORT_OPTIONS } from '../../consts';

import type { SportActivitiesFilterBarProps } from './types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SportActivitiesFilterBar = ({
  filters,
  onFiltersChange,
  onAddActivity,
  className,
  'data-testid': testId = 'sport-activities-filter-bar',
}: SportActivitiesFilterBarProps) => {
  const { t } = useTranslation('sports');
  const [isExpanded, setIsExpanded] = useState(false);

  const currentSort = filters.sort ?? 'date_desc';
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.startDate ||
    filters.endDate ||
    (filters.sort && filters.sort !== 'date_desc'),
  );

  const handleReset = () => {
    onFiltersChange({
      sort: 'date_desc',
    });
  };

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-2xl border border-border bg-card-bg p-3 sm:p-3.5',
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
          aria-label={t('filters.title')}
          data-testid="activities-filters-toggle"
        >
          <Filter
            className={clsx(
              'size-4 shrink-0',
              hasActiveFilters ? 'text-bt-primary' : 'text-text-muted',
            )}
          />
          <span className="text-xs font-semibold sm:text-sm">{t('filters.title')}</span>
          {hasActiveFilters && <span className="size-2 rounded-full bg-bt-primary" />}
        </Button>

        {onAddActivity && (
          <ButtonWithIcon
            icon={Plus}
            label={t('entries.newEntry')}
            onClick={onAddActivity}
            className="xl:order-last text-xs sm:text-sm"
            data-testid="activities-add-button"
          />
        )}
      </div>

      {/* Filter inputs container */}
      <div
        className={clsx(
          'w-full flex-col gap-2.5 border-t border-border/40 pt-2.5',
          'xl:w-auto xl:border-t-0 xl:pt-0 xl:flex-row xl:items-center xl:gap-3 xl:flex-wrap',
          'xl:order-first',
          isExpanded ? 'flex' : 'hidden xl:flex',
        )}
        data-testid="activities-filters-container"
      >
        {/* Search Input */}
        <div className="w-full xl:w-56">
          <SearchFilterInput
            value={filters.search ?? ''}
            onChange={(val) =>
              onFiltersChange({
                ...filters,
                search: val || undefined,
              })
            }
            placeholder={t('filters.searchPlaceholder')}
            ariaLabel={t('filters.searchPlaceholder')}
            dataTestId="activities-search-input"
          />
        </div>

        {/* Date Range Pickers */}
        <div className="flex w-full items-center gap-2 xl:w-auto">
          <div className="flex-1 min-w-0 xl:w-44">
            <DateInput
              value={filters.startDate ?? ''}
              onChange={(startDate) =>
                onFiltersChange({ ...filters, startDate: startDate || undefined })
              }
              onClear={() => onFiltersChange({ ...filters, startDate: undefined })}
              isClearable
              aria-label={t('filters.startDate')}
              data-testid="activities-start-date-input"
            />
          </div>

          <span className="text-xs text-text-muted shrink-0">—</span>

          <div className="flex-1 min-w-0 xl:w-44">
            <DateInput
              value={filters.endDate ?? ''}
              onChange={(endDate) =>
                onFiltersChange({ ...filters, endDate: endDate || undefined })
              }
              onClear={() => onFiltersChange({ ...filters, endDate: undefined })}
              isClearable
              aria-label={t('filters.endDate')}
              data-testid="activities-end-date-input"
            />
          </div>
        </div>

        {/* Sort Selector */}
        <div className="w-full xl:w-52">
          <Select
            value={currentSort}
            onValueChange={(val) =>
              onFiltersChange({
                ...filters,
                sort: val as SportEntrySortOption,
              })
            }
          >
            <SelectTrigger
              aria-label={t('sort.dateDesc')}
              className="w-full"
              data-testid="activities-sort-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {SPORTS_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className={clsx(
              'flex h-10 items-center gap-1.5 self-start px-2.5 text-xs text-text-muted',
              'hover:text-fg sm:h-11 xl:self-auto',
            )}
            data-testid="activities-reset-filters-button"
          >
            <RotateCcw className="size-3.5 shrink-0" />
            <span>{t('filters.clearFilters')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
