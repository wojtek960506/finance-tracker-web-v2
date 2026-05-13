import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  type Transaction,
  type TransactionTransferDTO,
  updateTransferTransaction,
} from '@transactions/api';
import { useInvalidateTransactionQueries } from '@transactions/components/shared';
import {
  getTransferTransactionFormValues,
  normalizeTransferTransactionFormValues,
  TransferTransactionForm,
  type TransferTransactionFormValues,
} from '@transactions/components/transaction-forms';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

type UpdateTransferTransactionViewProps = {
  transaction: Transaction;
  transactionRef: Transaction;
};

export const UpdateTransferTransactionView = ({
  transaction,
  transactionRef,
}: UpdateTransferTransactionViewProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);

  const updateTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionTransferDTO) =>
      await updateTransferTransaction(transaction.id, payload),
    onSuccess: async () =>
      await invalidateQueries({
        includeTransactionDetails: false,
        includeTrashedTransactions: false,
        includeTrashedTransactionDetails: false,
        invalidateTransactionIds: [transaction.id, transactionRef.id],
      }),
  });

  const handleSubmit = async (values: TransferTransactionFormValues) => {
    try {
      const updatedTransactions = await updateTransactionMutation.mutateAsync({
        ...normalizeTransferTransactionFormValues(values),
        amount: Number(values.amount),
      });

      pushToast({
        variant: 'success',
        title: t('transactionUpdated'),
        message: shouldWarnAboutHiddenTransactions(updatedTransactions, returnTo)
          ? t('transactionMayBeHiddenByCurrentFilters')
          : undefined,
      });
      navigate(`/transactions/${transaction.id}`, {
        state: getTransactionsRouteState(returnTo),
      });
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
    <TransferTransactionForm
      key={`${transaction.id}:${transactionRef.id}`}
      defaultValues={getTransferTransactionFormValues(transaction, transactionRef)}
      isPending={updateTransactionMutation.isPending}
      mode="update"
      onSubmit={handleSubmit}
      onCancel={() =>
        navigate(`/transactions/${transaction.id}`, {
          state: getTransactionsRouteState(returnTo),
        })
      }
    />
  );
};
