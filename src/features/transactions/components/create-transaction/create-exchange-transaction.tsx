import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
} from './exchange-transaction-form';
import { toOptionalTrimmedString } from './shared-utils';

export const CreateExchangeTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionExchangeDTO) =>
      await createExchangeTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onSubmit = async (values: ExchangeTransactionFormValues) => {
    try {
      await createTransactionMutation.mutateAsync({
        ...values,
        amountExpense: Number(values.amountExpense),
        amountIncome: Number(values.amountIncome),
        additionalDescription: toOptionalTrimmedString(values.additionalDescription),
      });

      pushToast({
        variant: 'success',
        title: t('transactionCreated'),
      });
      navigate('/transactions');
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
      onCancel={() => navigate('/transactions/new')}
    />
  );
};
