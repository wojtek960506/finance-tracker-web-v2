import clsx from 'clsx';
import { Plus, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, DateInput, FilterPills } from '@shared/ui';

export type FuelFilters = {
  startDate?: string;
  endDate?: string;
  isFullTank?: boolean;
};

export type FuelFilterBarProps = {
  filters: FuelFilters;
  onFiltersChange: (filters: FuelFilters) => void;
  onAddEntry: () => void;
};

export const FuelFilterBar = ({
  filters,
  onFiltersChange,
  onAddEntry,
}: FuelFilterBarProps) => {
  const { t } = useTranslation('vehicles');

  const hasActiveFilters = Boolean(
    filters.startDate || filters.endDate || filters.isFullTank,
  );

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center justify-between gap-2.5 rounded-2xl',
        'border border-card-border/40 bg-modal-bg p-3 sm:p-3.5',
      )}
      data-testid="fuel-filter-bar"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="w-36 sm:w-40">
          <DateInput
            value={filters.startDate ?? ''}
            onChange={(val) =>
              onFiltersChange({ ...filters, startDate: val || undefined })
            }
            onClear={() => onFiltersChange({ ...filters, startDate: undefined })}
            isClearable
            aria-label={t('fuelPage.filters.startDate')}
          />
        </div>

        <span className="text-xs text-text-muted">—</span>

        <div className="w-36 sm:w-40">
          <DateInput
            value={filters.endDate ?? ''}
            onChange={(val) => onFiltersChange({ ...filters, endDate: val || undefined })}
            onClear={() => onFiltersChange({ ...filters, endDate: undefined })}
            isClearable
            aria-label={t('fuelPage.filters.endDate')}
          />
        </div>

        <FilterPills
          selected={filters.isFullTank ? 'fullTank' : 'all'}
          allLabel={t('fuelPage.filters.all')}
          allTestId="filter-all-tanks"
          items={[
            {
              key: 'fullTank',
              label: t('fuelPage.filters.fullTankOnly'),
              testId: 'filter-full-tank-only',
            },
          ]}
          onSelect={(key) =>
            onFiltersChange({
              ...filters,
              isFullTank: key === 'fullTank' ? true : undefined,
            })
          }
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className={clsx(
              'inline-flex items-center gap-1 rounded-lg px-2 py-1',
              'text-xs text-text-muted transition-colors hover:text-fg',
            )}
            data-testid="filter-reset-button"
          >
            <RotateCcw className="size-3" />
            <span>{t('fuelPage.filters.reset')}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          onClick={onAddEntry}
          data-testid="add-fuel-entry-button"
        >
          <Plus className="size-4" />
          <span>{t('fuelPage.newEntry')}</span>
        </Button>
      </div>
    </div>
  );
};
