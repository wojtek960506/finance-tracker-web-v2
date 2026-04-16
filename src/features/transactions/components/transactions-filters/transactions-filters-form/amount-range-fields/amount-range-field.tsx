import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldError } from '@transactions/components/transaction-forms';

import type { TransactionFiltersFormValues } from '../utils';

import { Label, NumberInput } from '@/shared/ui';

export const AmountRangeField = ({ name }: { name: 'minAmount' | 'maxAmount' }) => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();

  return (
    <Label>
      <span className="text-sm font-semibold">{t(name)}</span>
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
    </Label>
  );
};
