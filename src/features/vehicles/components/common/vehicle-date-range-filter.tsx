import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { DateInput } from '@shared/ui';

// TODO: Consider promoting to `@shared/ui/date-range-input` if other domain
// filters require controlled date range pickers in the future.
export type VehicleDateRangeFilterProps = {
  startDate?: string;
  endDate?: string;
  onStartDateChange: (startDate?: string) => void;
  onEndDateChange: (endDate?: string) => void;
  startDateLabel?: string;
  endDateLabel?: string;
  className?: string;
};

export const VehicleDateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateLabel,
  endDateLabel,
  className,
}: VehicleDateRangeFilterProps) => {
  const { t } = useTranslation('vehicles');

  const defaultStartLabel = t('actions.filterStartDate', { defaultValue: 'From Date' });
  const defaultEndLabel = t('actions.filterEndDate', { defaultValue: 'To Date' });

  return (
    <div className={clsx('flex w-full items-center gap-2 xl:w-auto', className)}>
      <div className="flex-1 min-w-0 xl:w-52">
        <DateInput
          value={startDate ?? ''}
          onChange={(val) => onStartDateChange(val || undefined)}
          onClear={() => onStartDateChange(undefined)}
          isClearable
          aria-label={startDateLabel ?? defaultStartLabel}
        />
      </div>

      <span className="text-xs text-text-muted shrink-0">—</span>

      <div className="flex-1 min-w-0 xl:w-52">
        <DateInput
          value={endDate ?? ''}
          onChange={(val) => onEndDateChange(val || undefined)}
          onClear={() => onEndDateChange(undefined)}
          isClearable
          aria-label={endDateLabel ?? defaultEndLabel}
        />
      </div>
    </div>
  );
};
