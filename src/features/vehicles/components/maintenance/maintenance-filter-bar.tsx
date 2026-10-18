import type { MaintenanceSection } from '@vehicles/api';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  ButtonWithIcon,
  DateRangeFilter,
  FilterBar,
  SearchFilterInput,
} from '@shared/ui';

import type { MaintenanceFilters } from './types';

export type MaintenanceFilterBarProps = {
  activeSection?: MaintenanceSection;
  filters: MaintenanceFilters;
  onFiltersChange: (filters: MaintenanceFilters) => void;
  onAddMaintenance: () => void;
};

export const MaintenanceFilterBar = ({
  activeSection = 'ownMaintenance',
  filters,
  onFiltersChange,
  onAddMaintenance,
}: MaintenanceFilterBarProps) => {
  const { t } = useTranslation('vehicles');

  const hasActiveFilters = Boolean(
    filters.search || filters.startDate || filters.endDate,
  );

  return (
    <FilterBar
      testId="maintenance-filter-bar"
      toggleTestId="toggle-maintenance-filters-button"
      resetTestId="reset-maintenance-filters-button"
      filterLabel={t('actions.filterTitle')}
      resetLabel={t('maintenancePage.filter.reset')}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={() => onFiltersChange({})}
      actionButton={
        <ButtonWithIcon
          icon={Plus}
          label={
            activeSection === 'previousOwnerServices'
              ? t('maintenancePage.addPreviousOwnerService')
              : t('maintenancePage.addMaintenance')
          }
          onClick={onAddMaintenance}
          className="xl:order-last"
          data-testid="add-maintenance-button"
        />
      }
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
      <DateRangeFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onStartDateChange={(startDate) => onFiltersChange({ ...filters, startDate })}
        onEndDateChange={(endDate) => onFiltersChange({ ...filters, endDate })}
        startDateLabel={t('maintenancePage.filter.startDate')}
        endDateLabel={t('maintenancePage.filter.endDate')}
        inputClassName="xl:w-52"
      />
    </FilterBar>
  );
};
