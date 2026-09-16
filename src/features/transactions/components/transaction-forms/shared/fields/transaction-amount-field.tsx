import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  REQUIRED_LABEL_CLASS_NAME,
} from '@transactions/components/transaction-forms';

import { NumberInput } from '@/components/ui/number-input';

type TransactionAmountFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name?: FieldPath<TFieldValues>;
  label?: string;
  errorMessage?: string;
  disabled?: boolean;
};

export const TransactionAmountField = <TFieldValues extends FieldValues>({
  control,
  name = 'amount' as FieldPath<TFieldValues>,
  label,
  errorMessage,
  disabled,
}: TransactionAmountFieldProps<TFieldValues>) => {
  const { t } = useTranslation('transactions');

  return (
    <Label>
      <span className={REQUIRED_LABEL_CLASS_NAME}>{label ?? t('amount')}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <NumberInput
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
            decimalPlaces={2}
            step="0.01"
            min="0"
            className={FIELD_CONTROL_CLASS_NAME}
          />
        )}
      />
      <FieldError message={errorMessage && t(errorMessage)} />
    </Label>
  );
};
