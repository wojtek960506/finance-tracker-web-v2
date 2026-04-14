import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  type Transaction,
  type TransactionStandardDTO,
  updateStandardTransaction,
} from '@transactions/api';
import { useInvalidateTransactionQueries } from '@transactions/components/shared';
import {
  getStandardTransactionFormValues,
  StandardTransactionForm,
  type StandardTransactionFormValues,
} from '@transactions/components/transaction-forms';

type UpdateStandardTransactionViewProps = {
  transaction: Transaction;
};

export const UpdateStandardTransactionView = ({
  transaction,
}: UpdateStandardTransactionViewProps) => {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();
  const { t } = useTranslation('transactions');

  const updateTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionStandardDTO) =>
      await updateStandardTransaction(transaction.id, payload),
    onSuccess: async () =>
      await invalidateQueries({
        includeTransactionDetails: false,
        includeTrashedTransactions: false,
        includeTrashedTransactionDetails: false,
        invalidateTransactionIds: [transaction.id],
      }),
  });

  const handleSubmit = async (values: StandardTransactionFormValues) => {
    try {
      await updateTransactionMutation.mutateAsync({
        ...values,
        description: values.description.trim(),
        amount: Number(values.amount),
      });

      pushToast({
        variant: 'success',
        title: t('transactionUpdated'),
      });
      navigate(`/transactions/${transaction.id}`);
    } catch (error) {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('transactionUpdateFailed'),
        message: apiError.message,
      });
    }
  };

  return (
    <StandardTransactionForm
      key={transaction.id}
      defaultValues={getStandardTransactionFormValues(transaction)}
      isPending={updateTransactionMutation.isPending}
      mode="update"
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/transactions/${transaction.id}`)}
    />
  );
};
