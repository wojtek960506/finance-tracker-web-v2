import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { useToastStore } from '@store/toast-store';
import { getTransaction, moveTransactionToTrash } from '@transactions/api';
import { useInvalidateTransactionQueries } from '@transactions/components/use-invalidate-transaction-queries';
import { Button } from '@ui';

import { getReferenceActionMessage } from '../transaction-action-copy';
import { TransactionActionModal } from '../transaction-action-modal';

import { TransactionDetailsCard } from './transaction-details-card';

export const TransactionDetails = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();

  const { transactionId } = useParams<{ transactionId: string }>();
  const [isMoveToTrashModalOpen, setIsMoveToTrashModalOpen] = useState(false);
  const moveToTrashButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => await getTransaction(transactionId!),
  });

  const moveToTrashMutation = useMutation({
    mutationFn: async (id: string) => await moveTransactionToTrash(id),
    onSuccess: invalidateQueries,
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;
  if (!transaction) return <p>No transaction</p>;

  const linkedMoveToTrashMessage = getReferenceActionMessage(
    transaction,
    'moveToTrash',
    t,
  );

  const handleMoveToTrash = async () => {
    try {
      await moveToTrashMutation.mutateAsync(transaction.id);
      setIsMoveToTrashModalOpen(false);
      pushToast({
        variant: 'success',
        title: t('transactionMovedToTrash'),
      });
      navigate('/transactions');
    } catch (moveError) {
      const apiError = normalizeApiError(moveError);
      pushToast({
        variant: 'error',
        title: t('transactionMoveToTrashFailed'),
        message: apiError.message,
      });
    }
  };

  return (
    <div className="flex flex-col max-w-100 m-auto gap-2 sm:gap-3">
      <TransactionActionModal
        isOpen={isMoveToTrashModalOpen}
        onClose={() => setIsMoveToTrashModalOpen(false)}
        ariaLabel={t('moveToTrashModalTitle')}
        title={t('moveToTrashModalTitle')}
        cancelLabel={t('cancel')}
        confirmLabel={t('moveToTrash')}
        onConfirm={() => void handleMoveToTrash()}
        restoreFocusRef={moveToTrashButtonRef}
        isPending={moveToTrashMutation.isPending}
        tone="destructive"
      >
        <p>
          {t('moveToTrashModalDescriptionPrefix')}{' '}
          <strong>{transaction.description}</strong>{' '}
          {t('moveToTrashModalDescriptionSuffix')}
        </p>
        {linkedMoveToTrashMessage ? <p>{linkedMoveToTrashMessage}</p> : null}
        <p>{t('moveToTrashModalRestoreHint')}</p>
      </TransactionActionModal>
      <Button
        variant="secondary"
        className={MAIN_BUTTON_TEXT}
        onClick={() => navigate(`/transactions/${transaction.id}/edit`)}
        disabled={moveToTrashMutation.isPending}
      >
        {t('updateTransaction')}
      </Button>
      <TransactionDetailsCard transaction={transaction} />
      <Button
        ref={moveToTrashButtonRef}
        variant="destructive"
        className={MAIN_BUTTON_TEXT}
        onClick={() => setIsMoveToTrashModalOpen(true)}
        disabled={moveToTrashMutation.isPending}
      >
        {t('moveToTrash')}
      </Button>
    </div>
  );
};
