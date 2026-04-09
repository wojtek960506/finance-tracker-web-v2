import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';
import {
  createTransferTransaction,
  type TransactionTransferDTO,
} from '@transactions/api';

import { toOptionalTrimmedString } from './shared-utils';
import {
  getDefaultTransferTransactionFormValues,
  TransferTransactionForm,
  type TransferTransactionFormValues,
} from './transfer-transaction-form';

export const CreateTransferTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const { t } = useTranslation('transactions');

  const createTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionTransferDTO) =>
      await createTransferTransaction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const onSubmit = async (values: TransferTransactionFormValues) => {
    try {
      await createTransactionMutation.mutateAsync({
        ...values,
        amount: Number(values.amount),
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
    <TransferTransactionForm
      defaultValues={getDefaultTransferTransactionFormValues()}
      isPending={createTransactionMutation.isPending}
      mode="create"
      onSubmit={onSubmit}
      onCancel={() => navigate('/transactions/new')}
    />
  );
};
