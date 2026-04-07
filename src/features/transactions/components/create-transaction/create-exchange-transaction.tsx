import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { normalizeApiError } from '@shared/api/api-error';
import { Card, DateInput, Input, NumberInput } from '@shared/ui';
import { useToastStore } from '@store/toast-store';
import {
  createExchangeTransaction,
  type TransactionExchangeCreateDTO,
} from '@transactions/api';

import { CurrencySelectField } from '../shared/currency-select-field';
import { NamedResourceSelectField } from '../shared/named-resource-select-field';

import { FieldError, FieldSection, TransactionFormActions } from './shared-components';
import {
  FIELD_CONTROL_CLASS_NAME,
  getDefaultTransactionDate,
  toOptionalTrimmedString,
} from './shared-utils';

const transactionFormSchema = z.object({
  date: z.string().min(1, 'dateRequired'),
  additionalDescription: z.string(),
  amountExpense: z
    .string()
    .min(1, 'amountExpenseRequired')
    .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
    .refine((value) => Number(value) > 0, 'amountPositive'),
  amountIncome: z
    .string()
    .min(1, 'amountIncomeRequired')
    .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
    .refine((value) => Number(value) > 0, 'amountPositive'),
  currencyExpense: z.string().min(1, 'expenseCurrencyRequired'),
  currencyIncome: z.string().min(1, 'incomeCurrencyRequired'),
  paymentMethodId: z.string().min(1, 'paymentMethodRequired'),
  accountId: z.string().min(1, 'accountRequired'),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const getDefaultValues = (): TransactionFormValues => ({
  date: getDefaultTransactionDate(),
  additionalDescription: '',
  amountExpense: '',
  amountIncome: '',
  currencyExpense: '',
  currencyIncome: '',
  paymentMethodId: '',
  accountId: '',
});

export const CreateExchangeTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: getDefaultValues(),
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionExchangeCreateDTO) =>
      await createExchangeTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onSubmit: SubmitHandler<TransactionFormValues> = async (values) => {
    try {
      await createTransactionMutation.mutateAsync({
        ...values,
        amountExpense: Number(values.amountExpense),
        amountIncome: Number(values.amountIncome),
        additionalDescription: toOptionalTrimmedString(values.additionalDescription),
      });

      pushToast({
        variant: 'success',
        title: t('transactionCreated'),
      });
      navigate('/transactions');
    } catch (error) {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('transactionCreateFailed'),
        message: apiError.message,
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl gap-4">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
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

        <TransactionFormActions
          isPending={createTransactionMutation.isPending}
          onCancel={() => navigate('/transactions/new')}
        />
      </form>
    </Card>
  );
};
