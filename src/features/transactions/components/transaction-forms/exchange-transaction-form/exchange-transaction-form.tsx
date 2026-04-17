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
  exchangeTransactionFormSchema,
  type ExchangeTransactionFormValues,
} from './utils';

type ExchangeTransactionFormProps = {
  defaultValues: ExchangeTransactionFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: ExchangeTransactionFormValues) => Promise<void> | void;
  onCancel: () => void;
};

// TODO think about splitting it (maybe it will have common fields with standard and transfer)
export const ExchangeTransactionForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: ExchangeTransactionFormProps) => {
  const { t } = useTranslation('transactions');
  const form = useForm<ExchangeTransactionFormValues>({
    resolver: zodResolver(exchangeTransactionFormSchema),
    defaultValues,
  });

  const handleSubmit: SubmitHandler<ExchangeTransactionFormValues> = async (values) => {
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

        <FieldSection className="sm:col-span-2">
          <span>{t('account')}</span>
          <Controller
            control={form.control}
            name="accountId"
            render={({ field }) => (
              <NamedResourceSelectField
                kind="accounts"
                value={field.value}
                onChange={field.onChange}
                placeholder={t('accountPlaceholder')}
                searchPlaceholder={t('searchAccountPlaceholder')}
                emptyMessage={t('noAccountsFound')}
                showMoreLabel={t('showMoreAccounts')}
                showLessLabel={t('showLessAccounts')}
              />
            )}
          />
          <FieldError
            message={
              form.formState.errors.accountId?.message &&
              t(form.formState.errors.accountId.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('amountExpense')}</span>
          <Controller
            control={form.control}
            name="amountExpense"
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
              form.formState.errors.amountExpense?.message &&
              t(form.formState.errors.amountExpense.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('expenseCurrency')}</span>
          <Controller
            control={form.control}
            name="currencyExpense"
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
              form.formState.errors.currencyExpense?.message &&
              t(form.formState.errors.currencyExpense.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('amountIncome')}</span>
          <Controller
            control={form.control}
            name="amountIncome"
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
              form.formState.errors.amountIncome?.message &&
              t(form.formState.errors.amountIncome.message)
            }
          />
        </FieldSection>

        <FieldSection>
          <span>{t('incomeCurrency')}</span>
          <Controller
            control={form.control}
            name="currencyIncome"
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
              form.formState.errors.currencyIncome?.message &&
              t(form.formState.errors.currencyIncome.message)
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
