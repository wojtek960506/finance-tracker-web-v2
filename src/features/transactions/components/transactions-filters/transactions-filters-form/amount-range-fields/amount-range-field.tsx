import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldError } from '@transactions/components/transaction-forms';

import { FilterFieldLabel } from '../filter-field-label';
import type { TransactionFiltersFormValues } from '../utils';

import { NumberInput } from '@/components/ui/number-input';

export const AmountRangeField = ({ name }: { name: 'minAmount' | 'maxAmount' }) => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();

  return (
    <FilterFieldLabel title={t(name)}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <NumberInput
            value={field.value}
            onValueChange={field.onChange}
            decimalPlaces={2}
            step="0.01"
            min="0"
          />
        )}
      />
      <FieldError
        message={
          form.formState.errors[name]?.message && t(form.formState.errors[name].message)
        }
      />
    </FilterFieldLabel>
  );
};
