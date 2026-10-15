import type { MaintenanceSection } from '@vehicles/api';
import { VehicleFilterBar } from '@vehicles/components/common';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, DateInput, SearchFilterInput } from '@shared/ui';

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
    <VehicleFilterBar
      testId="maintenance-filter-bar"
      toggleTestId="toggle-maintenance-filters-button"
      resetTestId="reset-maintenance-filters-button"
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
            onChange={(val) => onFiltersChange({ ...filters, endDate: val || undefined })}
            onClear={() => onFiltersChange({ ...filters, endDate: undefined })}
            isClearable
            aria-label={t('maintenancePage.filter.endDate')}
          />
        </div>
      </div>
    </VehicleFilterBar>
  );
};
