import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  createStandardTransaction,
  type TransactionStandardDTO,
} from '@transactions/api';

import {
  getDefaultStandardTransactionFormValues,
  StandardTransactionForm,
  type StandardTransactionFormValues,
} from './standard-transaction-form';

export const CreateStandardTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionStandardDTO) =>
      await createStandardTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onSubmit = async (values: StandardTransactionFormValues) => {
    try {
      await createTransactionMutation.mutateAsync({
        ...values,
        description: values.description.trim(),
        amount: Number(values.amount),
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
    <StandardTransactionForm
      defaultValues={getDefaultStandardTransactionFormValues()}
      isPending={createTransactionMutation.isPending}
      mode="create"
      onSubmit={onSubmit}
      onCancel={() => navigate('/transactions/new')}
    />
  );
};
