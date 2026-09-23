import clsx from 'clsx';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldError } from '@transactions/components/transaction-forms';

import { ACTIVE_FILTER_FIELD_CLASS_NAME } from '../consts';
import { FilterFieldLabel } from '../filter-field-label';
import type { TransactionFiltersFormValues } from '../utils';

import { NumberInput } from '@/components/ui/number-input';

export const AmountRangeField = ({ name }: { name: 'minAmount' | 'maxAmount' }) => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();
  const value = useWatch({ control: form.control, name });
  const isActive = value !== '' && value !== undefined && value !== null;

  return (
    <FilterFieldLabel title={t(name)} isActive={isActive}>
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
            className={clsx(isActive && ACTIVE_FILTER_FIELD_CLASS_NAME)}
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
