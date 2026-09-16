import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';
import { CurrencySelectField } from '@transactions/components/shared';
import {
  FieldError,
  REQUIRED_LABEL_CLASS_NAME,
} from '@transactions/components/transaction-forms';

type TransactionCurrencyFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name?: FieldPath<TFieldValues>;
  label?: string;
  errorMessage?: string;
};

export const TransactionCurrencyField = <TFieldValues extends FieldValues>({
  control,
  name = 'currency' as FieldPath<TFieldValues>,
  label,
  errorMessage,
}: TransactionCurrencyFieldProps<TFieldValues>) => {
  const { t } = useTranslation('transactions');

  return (
    <Label className="sm:col-span-2">
      <span className={REQUIRED_LABEL_CLASS_NAME}>{label ?? t('currency')}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <CurrencySelectField
            value={field.value}
            onChange={field.onChange}
            placeholder={t('currencyPlaceholder')}
            searchPlaceholder={t('searchCurrencyPlaceholder')}
            emptyMessage={t('noCurrenciesFound')}
          />
        )}
      />
      <FieldError message={errorMessage && t(errorMessage)} />
    </Label>
  );
};
