import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Card, Collapsible, DateInput, Label } from '@shared/ui';
import {
  CurrencySelectField,
  NamedResourceSelectField,
} from '@transactions/components/shared';
import {
  FIELD_CONTROL_CLASS_NAME,
  FieldError,
  preventImplicitFormSubmit,
  REQUIRED_LABEL_CLASS_NAME,
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
  const [paymentMethodId, accountExpenseId, accountIncomeId] = useWatch({
    control: form.control,
    name: ['paymentMethodId', 'accountExpenseId', 'accountIncomeId'],
  });
  const shouldOpenAdvancedFields = Boolean(
    paymentMethodId || accountExpenseId || accountIncomeId,
  );

  const handleSubmit: SubmitHandler<ExchangeTransactionFormValues> = async (values) => {
    await onSubmit(values);
  };

  return (
    <Card className="mx-auto w-full max-w-3xl gap-4">
      <form
        className="grid gap-3 sm:gap-4 sm:grid-cols-2"
        onKeyDown={preventImplicitFormSubmit}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Label>
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('date')}</span>
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

        <Label className="sm:col-span-2">
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('description')}</span>
          <Input
            {...form.register('description')}
            className={FIELD_CONTROL_CLASS_NAME}
            placeholder={t('description')}
          />
          <FieldError
            message={
              form.formState.errors.description?.message &&
              t(form.formState.errors.description.message)
            }
          />
        </Label>

        <Label>
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('amountExpense')}</span>
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
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('expenseCurrency')}</span>
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
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('amountIncome')}</span>
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
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('incomeCurrency')}</span>
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

        <div className="sm:col-span-2">
          <Collapsible
            header={<span className="text-base font-medium sm:text-lg">{t('advancedFields')}</span>}
            indicatorPosition="left"
            isInitiallyOpen={shouldOpenAdvancedFields}
            triggerMode="full-row"
            contentInset="none"
            contentClassName='px-[2px] pb-[2px]'
          >
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <Label className="sm:col-span-2">
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
                    />
                  )}
                />
                <FieldError
                  message={
                    form.formState.errors.accountExpenseId?.message &&
                    t(form.formState.errors.accountExpenseId.message)
                  }
                />
              </Label>

              <Label>
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
                    />
                  )}
                />
                <FieldError
                  message={
                    form.formState.errors.accountIncomeId?.message &&
                    t(form.formState.errors.accountIncomeId.message)
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
