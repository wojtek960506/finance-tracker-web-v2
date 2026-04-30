import { AmountRangeField } from './amount-range-field';

export const AmountRangeFields = () => (
  <div className="grid gap-2 amount-range-fields">
    <AmountRangeField name="minAmount" />
    <AmountRangeField name="maxAmount" />
  </div>
);
