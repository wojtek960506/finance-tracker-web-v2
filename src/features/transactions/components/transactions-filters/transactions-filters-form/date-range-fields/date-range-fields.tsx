import { DateRangeField } from './date-range-field';

export const DateRangeFields = () => (
  <div className="grid gap-2 date-range-fields">
    <DateRangeField name="startDate" />
    <DateRangeField name="endDate" />
  </div>
);
