import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
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
  TransactionBackButton,
  useInvalidateTransactionQueries,
} from '@transactions/components/shared';
import { Button } from '@ui';

import { TransactionDetailsCard } from './transaction-details-card';

export const TrashedTransactionDetails = () => {
  const { t } = useTranslation('transactions');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { transactionId } = useParams<{ transactionId: string }>();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();
  const [isTransactionQueryEnabled, setIsTransactionQueryEnabled] = useState(true);

  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] = useState(false);
  const restoreButtonRef = useRef<HTMLButtonElement | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);
  const queriesToRemoveRef = useRef<string[]>([]);

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trashed-transaction', transactionId],
    queryFn: async () => await getTrashedTransaction(transactionId!),
    enabled: Boolean(transactionId) && isTransactionQueryEnabled,
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => await restoreTransaction(id),
    onSuccess: async () =>
      await invalidateQueries({
        includeTransactionDetails: false,
        includeTrashedTransactionDetails: false,
      }),
  });
  const permanentDeleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteTrashedTransaction(id),
    onSuccess: async () =>
      await invalidateQueries({
        includeTransactions: false,
        includeTransactionDetails: false,
        includeTrashedTransactionDetails: false,
      }),
  });

  useEffect(
    () => () => {
      for (const queryId of queriesToRemoveRef.current) {
        queryClient.removeQueries({
          queryKey: ['trashed-transaction', queryId],
          exact: true,
        });
      }
    },
    [queryClient],
  );

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
      setIsTransactionQueryEnabled(false);
      await restoreMutation.mutateAsync(transaction.id);
      queriesToRemoveRef.current = [transaction.id, transaction.refId].filter(
        (queryId) => queryId !== undefined,
      );
      setIsRestoreModalOpen(false);
      pushToast({
        variant: 'success',
        title: t('transactionRestored'),
      });
      navigate(`/transactions/${transaction.id}`);
    } catch (restoreError) {
      setIsTransactionQueryEnabled(true);
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
      setIsTransactionQueryEnabled(false);
      await permanentDeleteMutation.mutateAsync(transaction.id);
      queriesToRemoveRef.current = [transaction.id, transaction.refId].filter(
        (queryId) => queryId !== undefined,
      );
      setIsPermanentDeleteModalOpen(false);
      pushToast({
        variant: 'success',
        title: t('transactionDeletedPermanently'),
      });
      navigate('/transactions/trash');
    } catch (deleteError) {
      setIsTransactionQueryEnabled(true);
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
      <TransactionBackButton
        label={t('backToTrash')}
        to="/transactions/trash"
        disabled={isAnyMutationPending}
      />
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
