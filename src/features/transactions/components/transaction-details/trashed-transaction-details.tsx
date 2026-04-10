import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { useToastStore } from '@store/toast-store';
import {
  deleteTrashedTransaction,
  getTrashedTransaction,
  restoreTransaction,
} from '@transactions/api';
import {
  getReferenceActionMessage,
  TransactionActionModal,
  useInvalidateTransactionQueries,
} from '@transactions/components/shared';
import { Button } from '@ui';

import { TransactionDetailsCard } from './transaction-details-card';

export const TrashedTransactionDetails = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();

  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] = useState(false);
  const restoreButtonRef = useRef<HTMLButtonElement | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trashed-transaction', transactionId],
    queryFn: async () => await getTrashedTransaction(transactionId!),
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => await restoreTransaction(id),
    onSuccess: invalidateQueries,
  });
  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteTrashedTransaction(id),
    onSuccess: invalidateQueries,
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;
  if (!transaction) return <p>No transaction</p>;

  const linkedRestoreMessage = getReferenceActionMessage(transaction, 'restore', t);
  const linkedPermanentDeleteMessage = getReferenceActionMessage(
    transaction,
    'permanentDelete',
    t,
  );
  const isAnyMutationPending =
    restoreMutation.isPending || permanentDeleteMutation.isPending;

  const handleRestore = async () => {
    try {
      await restoreMutation.mutateAsync(transaction.id);
      setIsRestoreModalOpen(false);
      pushToast({
        variant: 'success',
        title: t('transactionRestored'),
      });
      navigate(`/transactions/${transaction.id}`);
    } catch (restoreError) {
      const apiError = normalizeApiError(restoreError);
      pushToast({
        variant: 'error',
        title: t('transactionRestoreFailed'),
        message: apiError.message,
      });
    }
  };

  const handlePermanentDelete = async () => {
    try {
      await permanentDeleteMutation.mutateAsync(transaction.id);
      setIsPermanentDeleteModalOpen(false);
      pushToast({
        variant: 'success',
        title: t('transactionDeletedPermanently'),
      });
      navigate('/transactions/trash');
    } catch (deleteError) {
      const apiError = normalizeApiError(deleteError);
      pushToast({
        variant: 'error',
        title: t('transactionPermanentDeleteFailed'),
        message: apiError.message,
      });
    }
  };

  return (
    <div className="m-auto flex max-w-100 flex-col gap-2 sm:gap-3">
      <TransactionActionModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        ariaLabel={t('restoreTransactionModalTitle')}
        title={t('restoreTransactionModalTitle')}
        cancelLabel={t('cancel')}
        confirmLabel={t('restoreTransaction')}
        confirmVariant="primary"
        onConfirm={() => void handleRestore()}
        restoreFocusRef={restoreButtonRef}
        isPending={restoreMutation.isPending}
      >
        <p>
          {t('restoreTransactionModalDescriptionPrefix')}{' '}
          <strong>{transaction.description}</strong>{' '}
          {t('restoreTransactionModalDescriptionSuffix')}
        </p>
        {linkedRestoreMessage ? <p>{linkedRestoreMessage}</p> : null}
      </TransactionActionModal>
      <TransactionActionModal
        isOpen={isPermanentDeleteModalOpen}
        onClose={() => setIsPermanentDeleteModalOpen(false)}
        ariaLabel={t('permanentDeleteModalTitle')}
        title={t('permanentDeleteModalTitle')}
        cancelLabel={t('cancel')}
        confirmLabel={t('deleteTransactionPermanently')}
        onConfirm={() => void handlePermanentDelete()}
        restoreFocusRef={deleteButtonRef}
        isPending={permanentDeleteMutation.isPending}
        tone="destructive"
      >
        <p>
          {t('permanentDeleteModalDescriptionPrefix')}{' '}
          <strong>{transaction.description}</strong>{' '}
          {t('permanentDeleteModalDescriptionSuffix')}
        </p>
        {linkedPermanentDeleteMessage ? <p>{linkedPermanentDeleteMessage}</p> : null}
        <p>{t('permanentDeleteModalNoUndoHint')}</p>
      </TransactionActionModal>
      <Button
        variant="ghost"
        className="w-fit gap-2 self-start px-1 py-1 text-sm sm:px-1 sm:py-1 sm:text-base"
        onClick={() => navigate('/transactions/trash')}
        disabled={isAnyMutationPending}
      >
        <ArrowLeft className="size-4 sm:size-5" aria-hidden="true" />
        {t('backToTrash')}
      </Button>
      <Button
        ref={restoreButtonRef}
        variant="secondary"
        className={MAIN_BUTTON_TEXT}
        onClick={() => setIsRestoreModalOpen(true)}
        disabled={isAnyMutationPending}
      >
        {t('restoreTransaction')}
      </Button>
      <TransactionDetailsCard transaction={transaction} mode="trash" />
      <Button
        ref={deleteButtonRef}
        variant="destructive"
        className={MAIN_BUTTON_TEXT}
        onClick={() => setIsPermanentDeleteModalOpen(true)}
        disabled={isAnyMutationPending}
      >
        {t('deleteTransactionPermanently')}
      </Button>
    </div>
  );
};
