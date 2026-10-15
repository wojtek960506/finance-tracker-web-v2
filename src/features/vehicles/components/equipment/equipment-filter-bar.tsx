import clsx from 'clsx';
import { Filter, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ButtonWithIcon, DateInput, SearchFilterInput } from '@shared/ui';

export type EquipmentFilters = {
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type EquipmentFilterBarProps = {
  filters: EquipmentFilters;
  onFiltersChange: (filters: EquipmentFilters) => void;
  onAddEquipment: () => void;
};

// TODO: Extract common vehicle filter bar component with cleaner distinction
// between mobile expandable panel and desktop inline layout.
export const EquipmentFilterBar = ({
  filters,
  onFiltersChange,
  onAddEquipment,
}: EquipmentFilterBarProps) => {
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
      data-testid="equipment-filter-bar"
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
          data-testid="toggle-equipment-filters-button"
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

        <ButtonWithIcon
          icon={Plus}
          label={t('equipmentPage.addEquipment')}
          onClick={onAddEquipment}
          className="xl:order-last"
          data-testid="add-equipment-button"
        />
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
            placeholder={t('equipmentPage.filter.search')}
            ariaLabel={t('equipmentPage.filter.search')}
            dataTestId="equipment-search-input"
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
              aria-label={t('equipmentPage.filter.startDate')}
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
              aria-label={t('equipmentPage.filter.endDate')}
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
            data-testid="reset-equipment-filters-button"
          >
            <RotateCcw className="size-3.5 shrink-0" />
            <span>{t('equipmentPage.filter.reset')}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
