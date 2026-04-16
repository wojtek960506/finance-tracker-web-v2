import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldError } from '@transactions/components/transaction-forms';

import type { TransactionFiltersFormValues } from './utils';

import { Label, NumberInput } from '@/shared/ui';

export const AmountRangeFields = () => {
  const { t } = useTranslation('transactions');
  const form = useFormContext<TransactionFiltersFormValues>();

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
      <Label>
        <span className="text-sm font-semibold">{t('minAmount')}</span>
        <Controller
          control={form.control}
          name="minAmount"
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
            form.formState.errors.minAmount?.message &&
            t(form.formState.errors.minAmount.message)
          }
        />
      </Label>

      <Label>
        <span className="text-sm font-semibold">{t('maxAmount')}</span>
        <Controller
          control={form.control}
          name="maxAmount"
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
            form.formState.errors.maxAmount?.message &&
            t(form.formState.errors.maxAmount.message)
          }
        />
      </Label>
    </div>
  );
};
