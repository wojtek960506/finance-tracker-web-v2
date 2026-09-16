import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Controller, type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Card, Label } from '@shared/ui';
import { NamedResourceSelectField } from '@transactions/components/shared';
import {
  FieldError,
  FORM_BUTTON_CLASS_NAME,
  preventImplicitFormSubmit,
  REQUIRED_LABEL_CLASS_NAME,
  SingleAccountAdvancedFields,
  TransactionAmountField,
  TransactionCurrencyField,
  TransactionDateField,
  TransactionDescriptionField,
  TransactionFormActions,
} from '@transactions/components/transaction-forms';
import { EXCHANGE_CATEGORY, TRANSFER_CATEGORY } from '@transactions/consts';
import {
  getTransactionTypeButtonClassName,
  getTransactionTypeButtonVariant,
} from '@transactions/utils';

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
        onKeyDown={preventImplicitFormSubmit}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <TransactionDateField
          control={form.control}
          name="date"
          errorMessage={form.formState.errors.date?.message}
          disabled={isPending}
        />

        <Label>
          <span className={REQUIRED_LABEL_CLASS_NAME}>{t('transactionType')}</span>
          <div className="grid grid-cols-2 gap-2">
            {standardTransactionTypeOptions.map((transactionType) => {
              const isActive = selectedTransactionType === transactionType;

              return (
                <Button
                  key={transactionType}
                  type="button"
                  variant={getTransactionTypeButtonVariant(transactionType, isActive)}
                  className={clsx(
                    FORM_BUTTON_CLASS_NAME,
                    getTransactionTypeButtonClassName(transactionType, isActive),
                  )}
                  onClick={() => form.setValue('transactionType', transactionType)}
                  disabled={isPending}
                >
                  {t(transactionType)}
                </Button>
              );
            })}
          </div>
        </Label>

        <TransactionDescriptionField
          registration={form.register('description')}
          errorMessage={form.formState.errors.description?.message}
          disabled={isPending}
        />

        <TransactionAmountField
          control={form.control}
          name="amount"
          errorMessage={form.formState.errors.amount?.message}
          disabled={isPending}
        />

        <TransactionCurrencyField
          control={form.control}
          name="currency"
          errorMessage={form.formState.errors.currency?.message}
          colSpan="single"
        />

        <SingleAccountAdvancedFields
          control={form.control}
          errors={form.formState.errors}
          isOpen={shouldOpenAdvancedFields}
        >
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
                  includeSystem
                  excludedSystemNames={[TRANSFER_CATEGORY, EXCHANGE_CATEGORY]}
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
        </SingleAccountAdvancedFields>

        <TransactionFormActions isPending={isPending} mode={mode} onCancel={onCancel} />
      </form>
    </Card>
  );
};
