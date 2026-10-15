import type { MaintenanceSection } from '@vehicles/api';
import clsx from 'clsx';
import { Filter, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DateInput, SearchFilterInput } from '@shared/ui';

import type { MaintenanceFilters } from './types';

export type MaintenanceFilterBarProps = {
  activeSection?: MaintenanceSection;
  filters: MaintenanceFilters;
  onFiltersChange: (filters: MaintenanceFilters) => void;
  onAddMaintenance: () => void;
};

// TODO: Extract common vehicle filter bar component with cleaner distinction
// between mobile expandable panel and desktop inline layout.
export const MaintenanceFilterBar = ({
  activeSection = 'ownMaintenance',
  filters,
  onFiltersChange,
  onAddMaintenance,
}: MaintenanceFilterBarProps) => {
  const { t } = useTranslation('vehicles');
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = Boolean(
    filters.search || filters.startDate || filters.endDate,
  );

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-2xl border border-border bg-modal-bg p-3 sm:p-3.5',
        'xl:flex-row xl:items-center xl:justify-between',
      )}
      data-testid="maintenance-filter-bar"
    >
      {/* Top Mobile Controls: Toggle on left, Add button on right */}
      <div className="flex items-center justify-between gap-2.5 xl:contents">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={clsx(
            'flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors',
            'sm:h-11 sm:px-3.5 xl:hidden',
            hasActiveFilters
              ? 'border-bt-primary/50 bg-bt-primary/10 text-bt-primary hover:bg-bt-primary/20'
              : 'border-border bg-card-bg text-text-muted hover:text-fg',
          )}
          aria-expanded={isExpanded}
          aria-label={t('actions.filterTitle')}
          data-testid="toggle-maintenance-filters-button"
        >
          <Filter
            className={clsx(
              'size-5 shrink-0',
              hasActiveFilters ? 'text-bt-primary' : 'text-text-muted',
            )}
          />
          <span className="text-xs font-semibold sm:text-sm">
            {t('actions.filterTitle')}
          </span>
          {hasActiveFilters && <span className="size-2 rounded-full bg-bt-primary" />}
        </Button>

        <Button
          variant="primary"
          onClick={onAddMaintenance}
          className={clsx(
            'flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold',
            'sm:h-11 sm:px-5 sm:text-base shrink-0',
            'xl:order-last',
          )}
          data-testid="add-maintenance-button"
        >
          <Plus className="size-5 shrink-0" />
          <span>
            {activeSection === 'previousOwnerServices'
              ? t('maintenancePage.addPreviousOwnerService')
              : t('maintenancePage.addMaintenance')}
          </span>
        </Button>
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
        {/* Search input */}
        <div className="w-full xl:w-56">
          <SearchFilterInput
            value={filters.search ?? ''}
            onChange={(val) =>
              onFiltersChange({
                ...filters,
                search: val || undefined,
              })
            }
            placeholder={t('maintenancePage.filter.search')}
            ariaLabel={t('maintenancePage.filter.search')}
            dataTestId="maintenance-search-input"
          />
        </div>

        {/* Date range pickers */}
        <div className="flex w-full items-center gap-2 xl:w-auto">
          <div className="flex-1 min-w-0 xl:w-52">
            <DateInput
              value={filters.startDate ?? ''}
              onChange={(val) =>
                onFiltersChange({ ...filters, startDate: val || undefined })
              }
              onClear={() => onFiltersChange({ ...filters, startDate: undefined })}
              isClearable
              aria-label={t('maintenancePage.filter.startDate')}
            />
          </div>

          <span className="text-xs text-text-muted shrink-0">—</span>

          <div className="flex-1 min-w-0 xl:w-52">
            <DateInput
              value={filters.endDate ?? ''}
              onChange={(val) =>
                onFiltersChange({ ...filters, endDate: val || undefined })
              }
              onClear={() => onFiltersChange({ ...filters, endDate: undefined })}
              isClearable
              aria-label={t('maintenancePage.filter.endDate')}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className={clsx(
              'flex h-10 items-center gap-1.5 self-start px-2.5 text-xs text-text-muted',
              'hover:text-fg sm:h-11 xl:self-auto',
            )}
            data-testid="reset-maintenance-filters-button"
          >
            <RotateCcw className="size-3.5 shrink-0" />
            <span>{t('maintenancePage.filter.reset')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
