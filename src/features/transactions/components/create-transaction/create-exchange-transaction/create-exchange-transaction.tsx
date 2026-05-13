import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  createExchangeTransaction,
  type TransactionExchangeDTO,
} from '@transactions/api';
import {
  ExchangeTransactionForm,
  type ExchangeTransactionFormValues,
  getDefaultExchangeTransactionFormValues,
  normalizeExchangeTransactionFormValues,
} from '@transactions/components/transaction-forms';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

export const CreateExchangeTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionExchangeDTO) =>
      await createExchangeTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onSubmit = async (values: ExchangeTransactionFormValues) => {
    try {
      const transactions = await createTransactionMutation.mutateAsync({
        ...normalizeExchangeTransactionFormValues(values),
        amountExpense: Number(values.amountExpense),
        amountIncome: Number(values.amountIncome),
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
    <ExchangeTransactionForm
      defaultValues={getDefaultExchangeTransactionFormValues()}
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
