import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  type Transaction,
  type TransactionExchangeDTO,
  updateExchangeTransaction,
} from '@transactions/api';
import { useInvalidateTransactionQueries } from '@transactions/components/shared';
import {
  ExchangeTransactionForm,
  type ExchangeTransactionFormValues,
  getExchangeTransactionFormValues,
  toOptionalTrimmedString,
} from '@transactions/components/transaction-forms';

type UpdateExchangeTransactionViewProps = {
  transaction: Transaction;
  transactionRef: Transaction;
};

export const UpdateExchangeTransactionView = ({
  transaction,
  transactionRef,
}: UpdateExchangeTransactionViewProps) => {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();
  const { t } = useTranslation('transactions');

  const updateTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionExchangeDTO) =>
      await updateExchangeTransaction(transaction.id, payload),
    onSuccess: async () =>
      await invalidateQueries({
        includeTransactionDetails: false,
        includeTrashedTransactions: false,
        includeTrashedTransactionDetails: false,
        invalidateTransactionIds: [transaction.id, transactionRef.id],
      }),
  });

  const handleSubmit = async (values: ExchangeTransactionFormValues) => {
    try {
      await updateTransactionMutation.mutateAsync({
        ...values,
        amountExpense: Number(values.amountExpense),
        amountIncome: Number(values.amountIncome),
        additionalDescription: toOptionalTrimmedString(values.additionalDescription),
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
    <ExchangeTransactionForm
      key={`${transaction.id}:${transactionRef.id}`}
      defaultValues={getExchangeTransactionFormValues(transaction, transactionRef)}
      isPending={updateTransactionMutation.isPending}
      mode="update"
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/transactions/${transaction.id}`)}
    />
  );
};
