import { VehicleFilterBar } from '@vehicles/components/common';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ButtonWithIcon, DateInput, SearchFilterInput } from '@shared/ui';

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
            onChange={(val) => onFiltersChange({ ...filters, endDate: val || undefined })}
            onClear={() => onFiltersChange({ ...filters, endDate: undefined })}
            isClearable
            aria-label={t('equipmentPage.filter.endDate')}
          />
        </div>
      </div>
    </VehicleFilterBar>
  );
};
