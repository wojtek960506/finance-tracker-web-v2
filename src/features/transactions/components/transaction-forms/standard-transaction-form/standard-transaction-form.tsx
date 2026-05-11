import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Card, Collapsible, DateInput, Label } from '@shared/ui';
import {
  CurrencySelectField,
  NamedResourceSelectField,
} from '@transactions/components/shared';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  FORM_BUTTON_CLASS_NAME,
  TransactionFormActions,
} from '@transactions/components/transaction-forms';

import {
  standardTransactionFormSchema,
  type StandardTransactionFormValues,
  standardTransactionTypeOptions,
} from './utils';

import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';

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
  const [categoryId, paymentMethodId, accountId] = useWatch({
    control: form.control,
    name: ['categoryId', 'paymentMethodId', 'accountId'],
  });
  const shouldOpenAdvancedFields = Boolean(categoryId || paymentMethodId || accountId);

  const handleSubmit: SubmitHandler<StandardTransactionFormValues> = async (values) => {
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

        <Label>
          <span>{t('transactionType')}</span>
          <div className="grid grid-cols-2 gap-2">
            {standardTransactionTypeOptions.map((transactionType) => {
              const isActive = selectedTransactionType === transactionType;

              return (
                <Button
                  key={transactionType}
                  type="button"
                  variant={isActive ? 'primary' : 'outline'}
                  className={FORM_BUTTON_CLASS_NAME}
                  onClick={() => form.setValue('transactionType', transactionType)}
                >
                  {t(transactionType)}
                </Button>
              );
            })}
          </div>
        </Label>

        <Label className="sm:col-span-2">
          <span>{t('description')}</span>
          <Input {...form.register('description')} className={FIELD_CONTROL_CLASS_NAME} />
          <FieldError
            message={
              form.formState.errors.description?.message &&
              t(form.formState.errors.description.message)
            }
          />
        </Label>

        <Label>
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
        </Label>

        <Label>
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
        </Label>

        <div className="sm:col-span-2">
          <Collapsible
            header={<span className="text-sm font-medium sm:text-base">{t('advancedFields')}</span>}
            indicatorPosition="left"
            isInitiallyOpen={shouldOpenAdvancedFields}
            triggerMode="full-row"
            contentInset="none"
          >
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <Label className="sm:col-span-2">
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
                    />
                  )}
                />
                <FieldError
                  message={
                    form.formState.errors.categoryId?.message &&
                    t(form.formState.errors.categoryId.message)
                  }
                />
              </Label>

              <Label>
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
              </Label>

              <Label>
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
            </div>
          </Collapsible>
        </div>

        <TransactionFormActions isPending={isPending} mode={mode} onCancel={onCancel} />
      </form>
    </Card>
  );
};
