import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { normalizeApiError } from '@shared/api/api-error';
import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { useToastStore } from '@store/toast-store';
import { getTransaction, moveTransactionToTrash } from '@transactions/api';
import {
  getReferenceActionMessage,
  TransactionActionModal,
  TransactionBackButton,
  TransactionFallbackState,
  useInvalidateTransactionQueries,
} from '@transactions/components/shared';
import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
  isNotFoundTransactionQueryError,
} from '@transactions/utils';
import { Button, Card, LoadingState } from '@ui';

import { TransactionDetailsCard } from '../transaction-details-card';

// TODO maybe split this file
export const TransactionDetails = () => {
  const { t } = useTranslation('transactions');
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();

  const { transactionId } = useParams<{ transactionId: string }>();
  const returnTo = getTransactionsReturnTo(location.state);
  const [isMoveToTrashModalOpen, setIsMoveToTrashModalOpen] = useState(false);
  const [isTransactionQueryEnabled, setIsTransactionQueryEnabled] = useState(true);
  const moveToTrashButtonRef = useRef<HTMLButtonElement | null>(null);
  const queriesToRemoveRef = useRef<string[]>([]);

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => await getTransaction(transactionId!),
    enabled: Boolean(transactionId) && isTransactionQueryEnabled,
    retry: false,
  });

  const moveToTrashMutation = useMutation({
    mutationFn: async (id: string) => await moveTransactionToTrash(id),
    onSuccess: async () =>
      await invalidateQueries({
        includeTransactionDetails: false,
        includeTrashedTransactionDetails: false,
      }),
  });

  useEffect(
    () => () => {
      for (const queryId of queriesToRemoveRef.current) {
        queryClient.removeQueries({
          queryKey: ['transaction', queryId],
          exact: true,
        });
      }
    },
    [queryClient],
  );

  if (isLoading) {
    return (
      <div className="m-auto flex max-w-100 flex-col gap-2 sm:gap-3">
        <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:p-8">
          <LoadingState
            title={t('loadingTransactionDetails')}
            description={t('loadingTransactionDetailsDescription')}
            className="py-4"
          />
        </Card>
      </div>
    );
  }

  const transactionNotFoundState = (
    <TransactionFallbackState
      title={t('transactionNotFoundTitle')}
      description={t('transactionNotFoundDescription')}
      actionLabel={t('backToTransactions')}
      to={returnTo}
    />
  );

  const transactionErrorState = error ? (
    <TransactionFallbackState
      title={t('transactionLoadFailedTitle')}
      description={error.message}
      actionLabel={t('backToTransactions')}
      to={returnTo}
    />
  ) : null;

  if (error && isNotFoundTransactionQueryError(error)) return transactionNotFoundState;
  if (error) return transactionErrorState;
  if (!transaction) return transactionNotFoundState;

  const linkedMoveToTrashMessage = getReferenceActionMessage(
    transaction,
    'moveToTrash',
    t,
  );

  const handleMoveToTrash = async () => {
    try {
      setIsTransactionQueryEnabled(false);
      await moveToTrashMutation.mutateAsync(transaction.id);
      queriesToRemoveRef.current = [transaction!.id, transaction!.refId].filter(
        (queryId) => queryId !== undefined,
      );
      queryClient.removeQueries({ queryKey: ['trashed-transactions'] });
      queryClient.removeQueries({ queryKey: ['transactions'] });
      queryClient.removeQueries({ queryKey: ['transaction-totals'] });
      setIsMoveToTrashModalOpen(false);
      pushToast({
        variant: 'success',
        title: t('transactionMovedToTrash'),
      });
      navigate(returnTo);
    } catch (moveError) {
      setIsTransactionQueryEnabled(true);
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
      <TransactionBackButton
        label={t('backToTransactions')}
        to={returnTo}
        disabled={moveToTrashMutation.isPending}
      />
      <Button
        variant="secondary"
        className={`${FORM_BUTTON_SIZE_CLASS} font-semibold sm:font-bold`}
        onClick={() =>
          navigate(`/transactions/${transaction.id}/edit`, {
            state: getTransactionsRouteState(returnTo),
          })
        }
        disabled={moveToTrashMutation.isPending}
      >
        {t('updateTransaction')}
      </Button>
      <TransactionDetailsCard transaction={transaction} />
      <Button
        ref={moveToTrashButtonRef}
        variant="destructive"
        className={`${FORM_BUTTON_SIZE_CLASS} font-semibold sm:font-bold`}
        onClick={() => setIsMoveToTrashModalOpen(true)}
        disabled={moveToTrashMutation.isPending}
      >
        {t('moveToTrash')}
      </Button>
    </div>
  );
};
