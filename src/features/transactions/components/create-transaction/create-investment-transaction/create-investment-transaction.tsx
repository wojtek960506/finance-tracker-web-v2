import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  createInvestmentTransaction,
  type TransactionInvestmentDTO,
} from '@transactions/api';
import {
  getDefaultInvestmentTransactionFormValues,
  InvestmentTransactionForm,
  type InvestmentTransactionFormValues,
  normalizeInvestmentTransactionFormValues,
} from '@transactions/components/transaction-forms';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  shouldWarnAboutHiddenTransactions,
} from '@transactions/utils';

export const CreateInvestmentTransaction = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');

  const instrumentIdFromQuery = searchParams.get('instrumentId') || '';
  const defaultReturnTo = instrumentIdFromQuery
    ? `/investments/instruments/${instrumentIdFromQuery}`
    : getTransactionsReturnTo(location.state);
  const returnTo = location.state?.returnTo ?? defaultReturnTo;

  const defaultValues = useMemo(
    () =>
      getDefaultInvestmentTransactionFormValues({
        instrumentId: instrumentIdFromQuery,
      }),
    [instrumentIdFromQuery],
  );

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionInvestmentDTO) =>
      await createInvestmentTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      await queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
  });

  const onSubmit = async (values: InvestmentTransactionFormValues) => {
    try {
      const transaction = await createTransactionMutation.mutateAsync(
        normalizeInvestmentTransactionFormValues(values),
      );

      pushToast({
        variant: 'success',
        title: t('transactionCreated'),
        message: shouldWarnAboutHiddenTransactions([transaction], returnTo)
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

  const handleCancel = () => {
    if (instrumentIdFromQuery) {
      navigate(returnTo);
      return;
    }
    navigate('/transactions/new', {
      state: getTransactionsRouteState(returnTo),
    });
  };

  return (
    <InvestmentTransactionForm
      defaultValues={defaultValues}
      isPending={createTransactionMutation.isPending}
      isInstrumentDisabled={Boolean(instrumentIdFromQuery)}
      mode="create"
      onSubmit={onSubmit}
      onCancel={handleCancel}
    />
  );
};
