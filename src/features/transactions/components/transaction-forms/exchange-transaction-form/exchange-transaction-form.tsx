import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Card, DateInput, Label } from '@shared/ui';
import {
  CurrencySelectField,
  NamedResourceSelectField,
} from '@transactions/components/shared';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  TransactionFormActions,
} from '@transactions/components/transaction-forms';

import {
  exchangeTransactionFormSchema,
  type ExchangeTransactionFormValues,
} from './utils';

import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';

type ExchangeTransactionFormProps = {
  defaultValues: ExchangeTransactionFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: ExchangeTransactionFormValues) => Promise<void> | void;
  onCancel: () => void;
};

// TODO think about splitting it (maybe it will have common fields with standard and transfer)
// TODO change additional description to description here and on backend
// TODO decide which fields has to be added to collapsible advanced fields
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
        className="grid gap-3 sm:gap-4 sm:grid-cols-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Label>
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
        </Label>

        <div className='flex flex-col gap-1 sm:gap-2'>
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
              />
            )}
          />
          <FieldError
            message={
              form.formState.errors.paymentMethodId?.message &&
              t(form.formState.errors.paymentMethodId.message)
            }
          />
        </div>

        <Label className="sm:col-span-2">
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
              />
            )}
          />
          <FieldError
            message={
              form.formState.errors.accountId?.message &&
              t(form.formState.errors.accountId.message)
            }
          />
        </Label>

        <Label>
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
        </Label>

        <Label>
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
        </Label>

        <Label>
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
        </Label>

        <Label>
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
        </Label>

        <Label className="sm:col-span-2">
          <span>{t('additionalDescription')}</span>
          <Input
            {...form.register('additionalDescription')}
            className={FIELD_CONTROL_CLASS_NAME}
            placeholder={t('additionalDescriptionPlaceholder')}
          />
        </Label>

        <TransactionFormActions isPending={isPending} mode={mode} onCancel={onCancel} />
      </form>
    </Card>
  );
};
