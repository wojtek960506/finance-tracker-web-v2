import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldError } from '@transactions/components/transaction-forms';

import { FilterFieldLabel } from '../filter-field-label';
import type { TransactionFiltersFormValues } from '../utils';

import { DateInput } from '@/shared/ui';

export const DateRangeField = ({ name }: { name: 'startDate' | 'endDate' }) => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();

  return (
    <FilterFieldLabel title={t(name)}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => <DateInput {...field} />}
      />
      <FieldError
        message={
          form.formState.errors[name]?.message && t(form.formState.errors[name].message)
        }
      />
    </FilterFieldLabel>
  );
};
