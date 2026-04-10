import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
  TransferTransactionForm,
  type TransferTransactionFormValues,
} from '../create-transaction';
import { toOptionalTrimmedString } from '../create-transaction/shared-utils';

type UpdateTransferTransactionViewProps = {
  transaction: Transaction;
  transactionRef: Transaction;
};

export const UpdateTransferTransactionView = ({
  transaction,
  transactionRef,
}: UpdateTransferTransactionViewProps) => {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();
  const { t } = useTranslation('transactions');

  const updateTransactionMutation = useMutation({
    mutationFn: async (payload: TransactionTransferDTO) =>
      await updateTransferTransaction(transaction.id, payload),
    onSuccess: invalidateQueries,
  });

  const handleSubmit = async (values: TransferTransactionFormValues) => {
    try {
      await updateTransactionMutation.mutateAsync({
        ...values,
        amount: Number(values.amount),
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
    <TransferTransactionForm
      key={`${transaction.id}:${transactionRef.id}`}
      defaultValues={getTransferTransactionFormValues(transaction, transactionRef)}
      isPending={updateTransactionMutation.isPending}
      mode="update"
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/transactions/${transaction.id}`)}
    />
  );
};
