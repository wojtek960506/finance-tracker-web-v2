import { VehicleDateRangeFilter, VehicleFilterBar } from '@vehicles/components/common';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, FilterPills } from '@shared/ui';

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
      <VehicleDateRangeFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onStartDateChange={(startDate) => onFiltersChange({ ...filters, startDate })}
        onEndDateChange={(endDate) => onFiltersChange({ ...filters, endDate })}
        startDateLabel={t('fuelPage.filters.startDate')}
        endDateLabel={t('fuelPage.filters.endDate')}
      />

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
