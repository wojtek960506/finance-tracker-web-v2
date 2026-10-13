import clsx from 'clsx';
import { Plus, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, DateInput, SearchFilterInput } from '@shared/ui';

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

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center justify-between gap-2.5 rounded-2xl',
        'border border-border bg-modal-bg p-3 sm:p-3.5',
      )}
      data-testid="equipment-filter-bar"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Search input */}
        <div className="w-36 sm:w-40">
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
        <div className="w-36 sm:w-40">
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

        <span className="text-xs text-text-muted">—</span>

        <div className="w-36 sm:w-40">
          <DateInput
            value={filters.endDate ?? ''}
            onChange={(val) => onFiltersChange({ ...filters, endDate: val || undefined })}
            onClear={() => onFiltersChange({ ...filters, endDate: undefined })}
            isClearable
            aria-label={t('equipmentPage.filter.endDate')}
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-text-muted hover:text-fg"
            data-testid="reset-equipment-filters-button"
          >
            <RotateCcw className="size-3.5" />
            <span>{t('equipmentPage.filter.reset')}</span>
          </Button>
        )}
      </div>

      <Button
        variant="primary"
        onClick={onAddEquipment}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold sm:text-sm"
        data-testid="add-equipment-button"
      >
        <Plus className="size-4" />
        <span>{t('equipmentPage.addEquipment')}</span>
      </Button>
    </div>
  );
};
