import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Label } from '@shared/ui';
import { NamedResourceSelectField } from '@transactions/components/shared';
import {
  FieldError,
  TransactionAdvancedFieldsCollapsible,
} from '@transactions/components/transaction-forms';

import type { InvestmentTransactionFormValues } from '../utils';

type InvestmentAdvancedFieldsProps = {
  control: Control<InvestmentTransactionFormValues>;
  errors: FieldErrors<InvestmentTransactionFormValues>;
  isOpen: boolean;
};

export const InvestmentAdvancedFields = ({
  control,
  errors,
  isOpen,
}: InvestmentAdvancedFieldsProps) => {
  const { t } = useTranslation('transactions');

  const paymentMethodError = errors.paymentMethodId?.message;
  const accountError = errors.accountId?.message;

  return (
    <TransactionAdvancedFieldsCollapsible isOpen={isOpen}>
      <Label>
        <span>{t('paymentMethod')}</span>
        <Controller
          control={control}
          name="paymentMethodId"
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
          name="accountId"
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
