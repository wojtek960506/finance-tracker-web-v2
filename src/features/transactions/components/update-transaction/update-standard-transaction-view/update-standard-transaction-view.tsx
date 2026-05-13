import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

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
  normalizeStandardTransactionFormValues,
  StandardTransactionForm,
  type StandardTransactionFormValues,
} from '@transactions/components/transaction-forms';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

type UpdateStandardTransactionViewProps = {
  transaction: Transaction;
};

export const UpdateStandardTransactionView = ({
  transaction,
}: UpdateStandardTransactionViewProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);

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
      const updatedTransaction = await updateTransactionMutation.mutateAsync({
        ...normalizeStandardTransactionFormValues(values),
        amount: Number(values.amount),
      });

      pushToast({
        variant: 'success',
        title: t('transactionUpdated'),
        message: shouldWarnAboutHiddenTransactions([updatedTransaction], returnTo)
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
    <StandardTransactionForm
      key={transaction.id}
      defaultValues={getStandardTransactionFormValues(transaction)}
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
