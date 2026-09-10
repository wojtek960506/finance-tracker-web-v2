import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  type Transaction,
  type TransactionInvestmentDTO,
  updateInvestmentTransaction,
} from '@transactions/api';
import { useInvalidateTransactionQueries } from '@transactions/components/shared';
import {
  getInvestmentTransactionFormValues,
  InvestmentTransactionForm,
  type InvestmentTransactionFormValues,
  normalizeInvestmentTransactionFormValues,
} from '@transactions/components/transaction-forms';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

type UpdateInvestmentTransactionViewProps = {
  transaction: Transaction;
};

export const UpdateInvestmentTransactionView = ({
  transaction,
}: UpdateInvestmentTransactionViewProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);

  const updateTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionInvestmentDTO) =>
      await updateInvestmentTransaction(transaction.id, payload),
    onSuccess: async () => {
      await invalidateQueries({
        includeTransactionDetails: false,
        includeTrashedTransactions: false,
        includeTrashedTransactionDetails: false,
        invalidateTransactionIds: [transaction.id],
      });
    },
  });

  const handleSubmit = async (values: InvestmentTransactionFormValues) => {
    try {
      const updatedTransaction = await updateTransactionMutation.mutateAsync(
        normalizeInvestmentTransactionFormValues(values),
      );

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
    <InvestmentTransactionForm
      key={transaction.id}
      defaultValues={getInvestmentTransactionFormValues(transaction)}
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
