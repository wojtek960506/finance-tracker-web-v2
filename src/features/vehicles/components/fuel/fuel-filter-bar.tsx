import { VehicleFilterBar } from '@vehicles/components/common';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, DateInput, FilterPills } from '@shared/ui';

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

  return (
    <VehicleFilterBar
      testId="fuel-filter-bar"
      toggleTestId="toggle-fuel-filters-button"
      hasActiveFilters={hasActiveFilters}
      onResetFilters={() => onFiltersChange({})}
      actionButton={
        <ButtonWithIcon
          icon={Plus}
          label={t('fuelPage.newEntry')}
          onClick={onAddEntry}
          className="xl:order-last"
          data-testid="add-fuel-entry-button"
        />
      }
    >
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
            aria-label={t('fuelPage.filters.startDate')}
          />
        </div>

        <span className="text-xs text-text-muted shrink-0">—</span>

        <div className="flex-1 min-w-0 xl:w-52">
          <DateInput
            value={filters.endDate ?? ''}
            onChange={(val) => onFiltersChange({ ...filters, endDate: val || undefined })}
            onClear={() => onFiltersChange({ ...filters, endDate: undefined })}
            isClearable
            aria-label={t('fuelPage.filters.endDate')}
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2">
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
      </div>
    </VehicleFilterBar>
  );
};
