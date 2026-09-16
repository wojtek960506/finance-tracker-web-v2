import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Card } from '@shared/ui';
import {
  DualAccountAdvancedFields,
  preventImplicitFormSubmit,
  TransactionAmountField,
  TransactionCurrencyField,
  TransactionDateField,
  TransactionDescriptionField,
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
        <TransactionDateField
          control={form.control}
          name="date"
          errorMessage={form.formState.errors.date?.message}
          disabled={isPending}
        />

        <TransactionDescriptionField
          registration={form.register('description')}
          errorMessage={form.formState.errors.description?.message}
          disabled={isPending}
        />

        <TransactionAmountField
          control={form.control}
          name="amountExpense"
          label={t('amountExpense')}
          errorMessage={form.formState.errors.amountExpense?.message}
          disabled={isPending}
        />

        <TransactionCurrencyField
          control={form.control}
          name="currencyExpense"
          label={t('expenseCurrency')}
          errorMessage={form.formState.errors.currencyExpense?.message}
          colSpan="single"
        />

        <TransactionAmountField
          control={form.control}
          name="amountIncome"
          label={t('amountIncome')}
          errorMessage={form.formState.errors.amountIncome?.message}
          disabled={isPending}
        />

        <TransactionCurrencyField
          control={form.control}
          name="currencyIncome"
          label={t('incomeCurrency')}
          errorMessage={form.formState.errors.currencyIncome?.message}
          colSpan="single"
        />

        <DualAccountAdvancedFields
          control={form.control}
          errors={form.formState.errors}
          isOpen={shouldOpenAdvancedFields}
        />

        <TransactionFormActions isPending={isPending} mode={mode} onCancel={onCancel} />
      </form>
    </Card>
  );
};
