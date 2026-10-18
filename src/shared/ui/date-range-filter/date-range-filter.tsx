import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { DateInput } from '@shared/ui/date-input';

import type { DateRangeFilterProps } from './types';

export const DateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateLabel,
  endDateLabel,
  startDateTestId,
  endDateTestId,
  className,
  inputClassName,
}: DateRangeFilterProps) => {
  const { t } = useTranslation('common');

  const resolvedStartLabel = startDateLabel ?? t('startDate');
  const resolvedEndLabel = endDateLabel ?? t('endDate');

  return (
    <div className={clsx('flex w-full items-center gap-2 xl:w-auto', className)}>
      <div className={clsx('flex-1 min-w-0 xl:w-48', inputClassName)}>
        <DateInput
          value={startDate ?? ''}
          onChange={(val) => onStartDateChange(val || undefined)}
          onClear={() => onStartDateChange(undefined)}
          isClearable
          aria-label={resolvedStartLabel}
          data-testid={startDateTestId}
        />
      </div>

      <span className="text-xs text-text-muted shrink-0">—</span>

      <div className={clsx('flex-1 min-w-0 xl:w-48', inputClassName)}>
        <DateInput
          value={endDate ?? ''}
          onChange={(val) => onEndDateChange(val || undefined)}
          onClear={() => onEndDateChange(undefined)}
          isClearable
          aria-label={resolvedEndLabel}
          data-testid={endDateTestId}
        />
      </div>
    </div>
  );
};
