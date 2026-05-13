import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  createTransferTransaction,
  type TransactionTransferDTO,
} from '@transactions/api';
import {
  getDefaultTransferTransactionFormValues,
  normalizeTransferTransactionFormValues,
  TransferTransactionForm,
  type TransferTransactionFormValues,
} from '@transactions/components/transaction-forms';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

export const CreateTransferTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionTransferDTO) =>
      await createTransferTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onSubmit = async (values: TransferTransactionFormValues) => {
    try {
      const transactions = await createTransactionMutation.mutateAsync({
        ...normalizeTransferTransactionFormValues(values),
        amount: Number(values.amount),
      });

      pushToast({
        variant: 'success',
        title: t('transactionCreated'),
        message: shouldWarnAboutHiddenTransactions(transactions, returnTo)
          ? t('transactionMayBeHiddenByCurrentFilters')
          : undefined,
      });
      queryClient.removeQueries({ queryKey: ['transactions'] });
      queryClient.removeQueries({ queryKey: ['transaction-totals'] });
      navigate(returnTo);
    } catch (error) {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('transactionCreateFailed'),
        message: apiError.message,
      });
    }
  };

  return (
    <TransferTransactionForm
      defaultValues={getDefaultTransferTransactionFormValues()}
      isPending={createTransactionMutation.isPending}
      mode="create"
      onSubmit={onSubmit}
      onCancel={() =>
        navigate('/transactions/new', {
          state: getTransactionsRouteState(returnTo),
        })
      }
    />
  );
};
