import { VehicleDateRangeFilter, VehicleFilterBar } from '@vehicles/components/common';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, SearchFilterInput } from '@shared/ui';

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

export const EquipmentFilterBar = ({
  filters,
  onFiltersChange,
  onAddEquipment,
}: EquipmentFilterBarProps) => {
  const { t } = useTranslation('vehicles');

  const hasActiveFilters = Boolean(
    filters.search || filters.startDate || filters.endDate,
  );

  return (
    <VehicleFilterBar
      testId="equipment-filter-bar"
      toggleTestId="toggle-equipment-filters-button"
      resetTestId="reset-equipment-filters-button"
      resetLabel={t('equipmentPage.filter.reset')}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={() => onFiltersChange({})}
      actionButton={
        <ButtonWithIcon
          icon={Plus}
          label={t('equipmentPage.addEquipment')}
          onClick={onAddEquipment}
          className="xl:order-last"
          data-testid="add-equipment-button"
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
          placeholder={t('equipmentPage.filter.search')}
          ariaLabel={t('equipmentPage.filter.search')}
          dataTestId="equipment-search-input"
        />
      </div>

      {/* Date range pickers */}
      <VehicleDateRangeFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onStartDateChange={(startDate) => onFiltersChange({ ...filters, startDate })}
        onEndDateChange={(endDate) => onFiltersChange({ ...filters, endDate })}
        startDateLabel={t('equipmentPage.filter.startDate')}
        endDateLabel={t('equipmentPage.filter.endDate')}
      />
    </VehicleFilterBar>
  );
};
