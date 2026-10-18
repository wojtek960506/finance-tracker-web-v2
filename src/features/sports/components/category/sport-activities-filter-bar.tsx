import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  ButtonWithIcon,
  DateRangeFilter,
  FilterBar,
  SearchFilterInput,
} from '@shared/ui';

import type { SportEntrySortOption } from '../../api';
import { SPORTS_SORT_OPTIONS } from '../../consts';

import type { SportActivitiesFilterBarProps } from './types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SportActivitiesFilterBar = ({
  filters,
  onFiltersChange,
  onAddActivity,
  className,
  'data-testid': testId = 'sport-activities-filter-bar',
}: SportActivitiesFilterBarProps) => {
  const { t } = useTranslation('sports');

  const currentSort = filters.sort ?? 'date_desc';
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.startDate ||
    filters.endDate ||
    (filters.sort && filters.sort !== 'date_desc'),
  );

  const handleReset = () => {
    onFiltersChange({
      sort: 'date_desc',
    });
  };

  return (
    <FilterBar
      testId={testId}
      toggleTestId="activities-filters-toggle"
      containerTestId="activities-filters-container"
      resetTestId="activities-reset-filters-button"
      filterLabel={t('filters.title')}
      resetLabel={t('filters.clearFilters')}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={handleReset}
      className={className}
      actionButton={
        onAddActivity && (
          <ButtonWithIcon
            icon={Plus}
            label={t('entries.newEntry')}
            onClick={onAddActivity}
            className="xl:order-last text-xs sm:text-sm"
            data-testid="activities-add-button"
          />
        )
      }
    >
      {/* Search Input */}
      <div className="w-full xl:w-56">
        <SearchFilterInput
          value={filters.search ?? ''}
          onChange={(val) =>
            onFiltersChange({
              ...filters,
              search: val || undefined,
            })
          }
          placeholder={t('filters.searchPlaceholder')}
          ariaLabel={t('filters.searchPlaceholder')}
          dataTestId="activities-search-input"
        />
      </div>

      {/* Date Range Pickers */}
      <DateRangeFilter
        startDate={filters.startDate}
        endDate={filters.endDate}
        onStartDateChange={(startDate) => onFiltersChange({ ...filters, startDate })}
        onEndDateChange={(endDate) => onFiltersChange({ ...filters, endDate })}
        startDateLabel={t('filters.startDate')}
        endDateLabel={t('filters.endDate')}
        startDateTestId="activities-start-date-input"
        endDateTestId="activities-end-date-input"
        inputClassName="xl:w-44"
      />

      {/* Sort Selector */}
      <div className="w-full xl:w-52">
        <Select
          value={currentSort}
          onValueChange={(val) =>
            onFiltersChange({
              ...filters,
              sort: val as SportEntrySortOption,
            })
          }
        >
          <SelectTrigger
            aria-label={t('sort.dateDesc')}
            className="w-full"
            data-testid="activities-sort-select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {SPORTS_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FilterBar>
  );
};
