import type { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';
import { NamedResourceSelectField } from '@transactions/components/shared';
import { FieldError } from '@transactions/components/transaction-forms';

import { TransactionAdvancedFieldsCollapsible } from './transaction-advanced-fields-collapsible';

type DualAccountAdvancedFieldsProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  isOpen: boolean;
};

export const DualAccountAdvancedFields = <TFieldValues extends FieldValues>({
  control,
  errors,
  isOpen,
}: DualAccountAdvancedFieldsProps<TFieldValues>) => {
  const { t } = useTranslation('transactions');

  const paymentMethodError = errors['paymentMethodId' as keyof TFieldValues]?.message;
  const fromAccountError = errors['accountExpenseId' as keyof TFieldValues]?.message;
  const toAccountError = errors['accountIncomeId' as keyof TFieldValues]?.message;

  return (
    <TransactionAdvancedFieldsCollapsible isOpen={isOpen}>
      <Label className="sm:col-span-2">
        <span>{t('paymentMethod')}</span>
        <Controller
          control={control}
          name={'paymentMethodId' as Path<TFieldValues>}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="paymentMethods"
              value={field.value}
              onChange={field.onChange}
              placeholder={t('paymentMethodPlaceholder')}
            />
          )}
        />
        <FieldError
          message={
            typeof paymentMethodError === 'string' ? t(paymentMethodError) : undefined
          }
        />
      </Label>

      <Label>
        <span>{t('fromAccount')}</span>
        <Controller
          control={control}
          name={'accountExpenseId' as Path<TFieldValues>}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder={t('fromAccountPlaceholder')}
            />
          )}
        />
        <FieldError
          message={typeof fromAccountError === 'string' ? t(fromAccountError) : undefined}
        />
      </Label>

      <Label>
        <span>{t('toAccount')}</span>
        <Controller
          control={control}
          name={'accountIncomeId' as Path<TFieldValues>}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder={t('toAccountPlaceholder')}
            />
          )}
        />
        <FieldError
          message={typeof toAccountError === 'string' ? t(toAccountError) : undefined}
        />
      </Label>
    </TransactionAdvancedFieldsCollapsible>
  );
};
