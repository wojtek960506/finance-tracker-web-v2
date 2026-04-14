import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Card, DateInput, Input, NumberInput } from '@shared/ui';
import {
  CurrencySelectField,
  NamedResourceSelectField,
} from '@transactions/components/shared';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  FieldSection,
  TransactionFormActions,
} from '@transactions/components/transaction-forms';

import {
  transferTransactionFormSchema,
  type TransferTransactionFormValues,
} from './utils';

type TransferTransactionFormProps = {
  defaultValues: TransferTransactionFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: TransferTransactionFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export const TransferTransactionForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: TransferTransactionFormProps) => {
  const { t } = useTranslation('transactions');
  const form = useForm<TransferTransactionFormValues>({
    resolver: zodResolver(transferTransactionFormSchema),
    defaultValues,
  });

  const handleSubmit: SubmitHandler<TransferTransactionFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <Card className="mx-auto w-full max-w-3xl gap-4">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FieldSection>
          <span>{t('date')}</span>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <DateInput {...field} className={FIELD_CONTROL_CLASS_NAME} />
            )}
          />
          <FieldError
            message={
              form.formState.errors.date?.message && t(form.formState.errors.date.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('paymentMethod')}</span>
          <Controller
            control={form.control}
            name="paymentMethodId"
            render={({ field }) => (
              <NamedResourceSelectField
                kind="paymentMethods"
                value={field.value}
                onChange={field.onChange}
                placeholder={t('paymentMethodPlaceholder')}
                searchPlaceholder={t('searchPaymentMethodPlaceholder')}
                emptyMessage={t('noPaymentMethodsFound')}
                showMoreLabel={t('showMorePaymentMethods')}
                showLessLabel={t('showLessPaymentMethods')}
              />
            )}
          />
          <FieldError
            message={
              form.formState.errors.paymentMethodId?.message &&
              t(form.formState.errors.paymentMethodId.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('amount')}</span>
          <Controller
            control={form.control}
            name="amount"
            render={({ field }) => (
              <NumberInput
                value={field.value}
                onValueChange={field.onChange}
                decimalPlaces={2}
                step="0.01"
                min="0"
                className={FIELD_CONTROL_CLASS_NAME}
              />
            )}
          />
          <FieldError
            message={
              form.formState.errors.amount?.message &&
              t(form.formState.errors.amount.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('currency')}</span>
          <Controller
            control={form.control}
            name="currency"
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
          <FieldError
            message={
              form.formState.errors.currency?.message &&
              t(form.formState.errors.currency.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('fromAccount')}</span>
          <Controller
            control={form.control}
            name="accountExpenseId"
            render={({ field }) => (
              <NamedResourceSelectField
                kind="accounts"
                value={field.value}
                onChange={field.onChange}
                placeholder={t('fromAccountPlaceholder')}
                searchPlaceholder={t('searchAccountPlaceholder')}
                emptyMessage={t('noAccountsFound')}
                showMoreLabel={t('showMoreAccounts')}
                showLessLabel={t('showLessAccounts')}
              />
            )}
          />
          <FieldError
            message={
              form.formState.errors.accountExpenseId?.message &&
              t(form.formState.errors.accountExpenseId.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('toAccount')}</span>
          <Controller
            control={form.control}
            name="accountIncomeId"
            render={({ field }) => (
              <NamedResourceSelectField
                kind="accounts"
                value={field.value}
                onChange={field.onChange}
                placeholder={t('toAccountPlaceholder')}
                searchPlaceholder={t('searchAccountPlaceholder')}
                emptyMessage={t('noAccountsFound')}
                showMoreLabel={t('showMoreAccounts')}
                showLessLabel={t('showLessAccounts')}
              />
            )}
          />
          <FieldError
            message={
              form.formState.errors.accountIncomeId?.message &&
              t(form.formState.errors.accountIncomeId.message)
            }
          />
        </FieldSection>

        <FieldSection className="sm:col-span-2">
          <span>{t('additionalDescription')}</span>
          <Input
            {...form.register('additionalDescription')}
            className={FIELD_CONTROL_CLASS_NAME}
            placeholder={t('additionalDescriptionPlaceholder')}
          />
        </FieldSection>

        <TransactionFormActions isPending={isPending} mode={mode} onCancel={onCancel} />
      </form>
    </Card>
  );
};
