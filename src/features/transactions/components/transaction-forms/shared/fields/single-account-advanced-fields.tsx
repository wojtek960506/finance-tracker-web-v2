import type { ReactNode } from 'react';
import type { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';
import { NamedResourceSelectField } from '@transactions/components/shared';
import { FieldError } from '@transactions/components/transaction-forms';

import { TransactionAdvancedFieldsCollapsible } from './transaction-advanced-fields-collapsible';

type SingleAccountAdvancedFieldsProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  isOpen: boolean;
  children?: ReactNode;
};

export const SingleAccountAdvancedFields = <TFieldValues extends FieldValues>({
  control,
  errors,
  isOpen,
  children,
}: SingleAccountAdvancedFieldsProps<TFieldValues>) => {
  const { t } = useTranslation('transactions');

  const paymentMethodError = errors['paymentMethodId' as keyof TFieldValues]?.message;
  const accountError = errors['accountId' as keyof TFieldValues]?.message;

  return (
    <TransactionAdvancedFieldsCollapsible isOpen={isOpen}>
      {children}

      <Label>
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
        <span>{t('account')}</span>
        <Controller
          control={control}
          name={'accountId' as Path<TFieldValues>}
          render={({ field }) => (
            <NamedResourceSelectField
              kind="accounts"
              value={field.value}
              onChange={field.onChange}
              placeholder={t('accountPlaceholder')}
            />
          )}
        />
        <FieldError
          message={typeof accountError === 'string' ? t(accountError) : undefined}
        />
      </Label>
    </TransactionAdvancedFieldsCollapsible>
  );
};
