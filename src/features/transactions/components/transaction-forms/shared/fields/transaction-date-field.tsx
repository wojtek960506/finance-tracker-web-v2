import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DateInput, Label } from '@shared/ui';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  REQUIRED_LABEL_CLASS_NAME,
} from '@transactions/components/transaction-forms';

type TransactionDateFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name?: FieldPath<TFieldValues>;
  errorMessage?: string;
  disabled?: boolean;
};

export const TransactionDateField = <TFieldValues extends FieldValues>({
  control,
  name = 'date' as FieldPath<TFieldValues>,
  errorMessage,
  disabled,
}: TransactionDateFieldProps<TFieldValues>) => {
  const { t } = useTranslation('transactions');

  return (
    <Label>
      <span className={REQUIRED_LABEL_CLASS_NAME}>{t('date')}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DateInput
            {...field}
            disabled={disabled}
            className={FIELD_CONTROL_CLASS_NAME}
          />
        )}
      />
      <FieldError message={errorMessage && t(errorMessage)} />
    </Label>
  );
};
