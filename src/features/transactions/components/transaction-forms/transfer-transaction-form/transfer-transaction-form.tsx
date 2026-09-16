import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';

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
  transferTransactionFormSchema,
  type TransferTransactionFormValues,
} from './utils';

type TransferTransactionFormProps = {
  defaultValues: TransferTransactionFormValues;
  isPending: boolean;
  mode: 'create' | 'update';
  onSubmit: (values: TransferTransactionFormValues) => Promise<void> | void;
  onCancel: () => void;
};

// TODO think about splitting it to more components
export const TransferTransactionForm = ({
  defaultValues,
  isPending,
  mode,
  onSubmit,
  onCancel,
}: TransferTransactionFormProps) => {
  const form = useForm<TransferTransactionFormValues>({
    resolver: zodResolver(transferTransactionFormSchema),
    defaultValues,
  });
  const [paymentMethodId, accountExpenseId, accountIncomeId] = useWatch({
    control: form.control,
    name: ['paymentMethodId', 'accountExpenseId', 'accountIncomeId'],
  });
  const shouldOpenAdvancedFields = Boolean(
    paymentMethodId || accountExpenseId || accountIncomeId,
  );

  const handleSubmit: SubmitHandler<TransferTransactionFormValues> = async (values) => {
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
