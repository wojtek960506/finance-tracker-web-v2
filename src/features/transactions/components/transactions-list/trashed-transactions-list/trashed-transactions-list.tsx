import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { MAIN_BUTTON_TEXT } from '@shared/consts';
import { useLanguage } from '@shared/hooks';
import { useToastStore } from '@store/toast-store';
import { emptyTrash, getTrashedTransactions } from '@transactions/api';
import {
  TransactionActionModal,
  useInvalidateTransactionQueries,
} from '@transactions/components/shared';
import { Button, Input, Label } from '@ui';

import { TransactionPreview } from '../transaction-preview';
import { TransactionsPagination } from '../transactions-pagination';

const EMPTY_TRASH_CONFIRMATION_VALUE = 'DELETE';

export const TrashedTransactionsList = () => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();
  const pushToast = useToastStore((state) => state.pushToast);
  const invalidateQueries = useInvalidateTransactionQueries();
  const emptyTrashButtonRef = useRef<HTMLButtonElement | null>(null);

  const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false);
  const [emptyTrashConfirmation, setEmptyTrashConfirmation] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['trashed-transactions', page],
    queryFn: async () => await getTrashedTransactions(page),
  });

  const emptyTrashMutation = useMutation({
    mutationFn: async () => await emptyTrash(),
    onSuccess: async () =>
      await invalidateQueries({
        includeTransactions: false,
        includeTransactionDetails: false,
        includeTrashedTransactionDetails: false,
        removeAllTrashedTransactionDetails: true,
      }),
  });

  if (isLoading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  const handleOpenEmptyTrashModal = () => {
    setEmptyTrashConfirmation('');
    setIsEmptyTrashModalOpen(true);
  };

  const handleEmptyTrash = async () => {
    try {
      await emptyTrashMutation.mutateAsync();
      setIsEmptyTrashModalOpen(false);
      setEmptyTrashConfirmation('');
      pushToast({
        variant: 'success',
        title: t('trashEmptied'),
      });
    } catch (emptyTrashError) {
      const apiError = normalizeApiError(emptyTrashError);
      pushToast({
        variant: 'error',
        title: t('emptyTrashFailed'),
        message: apiError.message,
      });
    }
  };

  if (!data || data.items.length === 0) return <p>{t('trashIsEmpty')}</p>;

  return (
    <div className="m-auto flex max-w-150 flex-col gap-2 sm:gap-3">
      <TransactionActionModal
        isOpen={isEmptyTrashModalOpen}
        onClose={() => setIsEmptyTrashModalOpen(false)}
        ariaLabel={t('emptyTrashModalTitle')}
        title={t('emptyTrashModalTitle')}
        cancelLabel={t('cancel')}
        confirmLabel={t('emptyTrash')}
        onConfirm={() => void handleEmptyTrash()}
        restoreFocusRef={emptyTrashButtonRef}
        isPending={emptyTrashMutation.isPending}
        confirmDisabled={emptyTrashConfirmation !== EMPTY_TRASH_CONFIRMATION_VALUE}
        tone="destructive"
      >
        <div className="flex items-start gap-3 rounded-2xl border border-destructive-border bg-destructive text-destructive-foreground p-3 sm:p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 sm:size-6" />
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{t('emptyTrashWarningTitle')}</p>
            <p>{t('emptyTrashWarningDescription')}</p>
          </div>
        </div>
        <p>{t('emptyTrashModalDescription', { count: data.total })}</p>
        <p>{t('emptyTrashLinkedHint')}</p>
        <Label>
          <span className="text-sm font-semibold">
            {t('emptyTrashConfirmationLabel')}
          </span>
          <span className="text-sm text-text-muted">
            {t('emptyTrashConfirmationHint', {
              confirmationValue: EMPTY_TRASH_CONFIRMATION_VALUE,
            })}
          </span>
          <Input
            value={emptyTrashConfirmation}
            onChange={(event) => setEmptyTrashConfirmation(event.target.value)}
            placeholder={EMPTY_TRASH_CONFIRMATION_VALUE}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
        </Label>
      </TransactionActionModal>
      <Button
        ref={emptyTrashButtonRef}
        variant="destructive"
        className={MAIN_BUTTON_TEXT}
        onClick={handleOpenEmptyTrashModal}
        disabled={emptyTrashMutation.isPending}
      >
        {t('emptyTrash')}
      </Button>

      <ul className="flex flex-col gap-2 sm:gap-3">
        {data.items.map((transaction) => (
          <TransactionPreview
            key={transaction.id}
            transaction={transaction}
            detailsPathPrefix="/transactions/trash"
            metadata={
              <div className="flex flex-col gap-0.5 text-sm text-text-muted">
                <span>
                  {t('deletedAt')}:{' '}
                  {new Date(transaction.deletion.deletedAt).toLocaleString(language)}
                </span>
                <span>
                  {t('purgeAt')}:{' '}
                  {new Date(transaction.deletion.purgeAt).toLocaleString(language)}
                </span>
              </div>
            }
          />
        ))}
      </ul>
      <TransactionsPagination
        currentPage={data.page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
