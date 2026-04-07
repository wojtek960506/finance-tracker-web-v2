import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { normalizeApiError } from '@shared/api/api-error';
import { Button, Card, DateInput, Input, NumberInput } from '@shared/ui';
import { useToastStore } from '@store/toast-store';
import {
  createStandardTransaction,
  type TransactionStandardCreateDTO,
  type TransactionType,
} from '@transactions/api';

import { CurrencySelectField } from '../shared/currency-select-field';
import { NamedResourceSelectField } from '../shared/named-resource-select-field';

import { FieldError, FieldSection, TransactionFormActions } from './shared-components';
import { FIELD_CONTROL_CLASS_NAME, getDefaultTransactionDate } from './shared-utils';

const transactionFormSchema = z.object({
  date: z.string().min(1, 'dateRequired'),
  description: z.string().trim().min(1, 'descriptionRequired'),
  amount: z
    .string()
    .min(1, 'amountRequired')
    .refine((value) => !Number.isNaN(Number(value)), 'amountValidNumber')
    .refine((value) => Number(value) > 0, 'amountPositive'),
  currency: z.string().min(1, 'currencyRequired'),
  categoryId: z.string().min(1, 'categoryRequired'),
  paymentMethodId: z.string().min(1, 'paymentMethodRequired'),
  accountId: z.string().min(1, 'accountRequired'),
  transactionType: z.enum(['expense', 'income']),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const getDefaultValues = (): TransactionFormValues => ({
  date: getDefaultTransactionDate(),
  description: '',
  amount: '',
  currency: '',
  categoryId: '',
  paymentMethodId: '',
  accountId: '',
  transactionType: 'expense',
});

const transactionTypeOptions: TransactionType[] = ['expense', 'income'];

export const CreateStandardTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: getDefaultValues(),
  });
  const selectedTransactionType = useWatch({
    control: form.control,
    name: 'transactionType',
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionStandardCreateDTO) =>
      await createStandardTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onSubmit: SubmitHandler<TransactionFormValues> = async (values) => {
    try {
      await createTransactionMutation.mutateAsync({
        ...values,
        description: values.description.trim(),
        amount: Number(values.amount),
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
          <span>{t('transactionType')}</span>
          <div className="grid grid-cols-2 gap-2">
            {transactionTypeOptions.map((transactionType) => {
              const isActive = selectedTransactionType === transactionType;

              return (
                <Button
                  key={transactionType}
                  type="button"
                  variant={isActive ? 'primary' : 'outline'}
                  onClick={() => form.setValue('transactionType', transactionType)}
                >
                  {t(transactionType)}
                </Button>
              );
            })}
          </div>
        </FieldSection>

        <FieldSection className="sm:col-span-2">
          <span>{t('description')}</span>
          <Input {...form.register('description')} className={FIELD_CONTROL_CLASS_NAME} />
          <FieldError
            message={
              form.formState.errors.description?.message &&
              t(form.formState.errors.description.message)
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

        <FieldSection className="sm:col-span-2">
          <span>{t('category')}</span>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <NamedResourceSelectField
                kind="categories"
                value={field.value}
                onChange={field.onChange}
                placeholder={t('categoryPlaceholder')}
                searchPlaceholder={t('searchCategoryPlaceholder')}
                emptyMessage={t('noCategoriesFound')}
                showMoreLabel={t('showMoreCategories')}
                showLessLabel={t('showLessCategories')}
              />
            )}
          />
          <FieldError
            message={
              form.formState.errors.categoryId?.message &&
              t(form.formState.errors.categoryId.message)
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

        <TransactionFormActions
          isPending={createTransactionMutation.isPending}
          onCancel={() => navigate('/transactions/new')}
        />
      </form>
    </Card>
  );
};
