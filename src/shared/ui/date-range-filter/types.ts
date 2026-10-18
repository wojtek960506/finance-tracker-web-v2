export type DateRangeFilterProps = {
  startDate?: string;
  endDate?: string;
  onStartDateChange: (startDate?: string) => void;
  onEndDateChange: (endDate?: string) => void;
  startDateLabel?: string;
  endDateLabel?: string;
  startDateTestId?: string;
  endDateTestId?: string;
  className?: string;
  inputClassName?: string;
};
