import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Card, DateInput, Input, NumberInput } from '@shared/ui';
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
  standardTransactionFormSchema,
  type StandardTransactionFormValues,
  standardTransactionTypeOptions,
} from './utils';

type StandardTransactionFormProps = {
  defaultValues: StandardTransactionFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: StandardTransactionFormValues) => Promise<void> | void;
  onCancel: () => void;
};

// TODO think about splitting it
export const StandardTransactionForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: StandardTransactionFormProps) => {
  const { t } = useTranslation('transactions');
  const form = useForm<StandardTransactionFormValues>({
    resolver: zodResolver(standardTransactionFormSchema),
    defaultValues,
  });
  const selectedTransactionType = useWatch({
    control: form.control,
    name: 'transactionType',
  });

  const handleSubmit: SubmitHandler<StandardTransactionFormValues> = async (values) => {
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
          <span>{t('transactionType')}</span>
          <div className="grid grid-cols-2 gap-2">
            {standardTransactionTypeOptions.map((transactionType) => {
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

        <TransactionFormActions isPending={isPending} mode={mode} onCancel={onCancel} />
      </form>
    </Card>
  );
};
