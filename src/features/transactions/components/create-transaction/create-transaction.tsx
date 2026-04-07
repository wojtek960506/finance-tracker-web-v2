import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
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
  date: new Date().toISOString().slice(0, 10),
  description: '',
  amount: '',
  currency: '',
  categoryId: '',
  paymentMethodId: '',
  accountId: '',
  transactionType: 'expense',
});

const transactionTypeOptions: TransactionType[] = ['expense', 'income'];
const FIELD_CONTROL_CLASS_NAME = 'rounded-xl px-3 py-2 text-base sm:text-lg';

type FieldSectionProps = React.ComponentProps<'div'>;

const FieldSection = ({ className, ...props }: FieldSectionProps) => (
  <div {...props} className={clsx('flex flex-col gap-2', className)} />
);

export const CreateTransaction = () => {
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
          {form.formState.errors.date && (
            <span className="text-sm text-destructive">
              {t(form.formState.errors.date.message!)}
            </span>
          )}
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
          {form.formState.errors.description && (
            <span className="text-sm text-destructive">
              {t(form.formState.errors.description.message!)}
            </span>
          )}
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
          {form.formState.errors.amount && (
            <span className="text-sm text-destructive">
              {t(form.formState.errors.amount.message!)}
            </span>
          )}
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
          {form.formState.errors.currency && (
            <span className="text-sm text-destructive">
              {t(form.formState.errors.currency.message!)}
            </span>
          )}
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
          {form.formState.errors.categoryId && (
            <span className="text-sm text-destructive">
              {t(form.formState.errors.categoryId.message!)}
            </span>
          )}
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
          {form.formState.errors.paymentMethodId && (
            <span className="text-sm text-destructive">
              {t(form.formState.errors.paymentMethodId.message!)}
            </span>
          )}
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
          {form.formState.errors.accountId && (
            <span className="text-sm text-destructive">
              {t(form.formState.errors.accountId.message!)}
            </span>
          )}
        </FieldSection>

        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={() => navigate('/transactions')}>
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={createTransactionMutation.isPending}
          >
            {createTransactionMutation.isPending
              ? t('creatingTransaction')
              : t('saveTransaction')}
          </Button>
        </div>
      </form>
    </Card>
  );
};
