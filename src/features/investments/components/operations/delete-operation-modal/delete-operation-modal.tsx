import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  deleteOperation,
  type InvestmentInstrument,
  type InvestmentInstrumentSummary,
  type InvestmentOperation,
} from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useLanguage } from '@shared/hooks';
import { useToastStore } from '@shared/store/toast-store';
import { Button, Modal } from '@shared/ui';

export type DeleteOperationModalProps = {
  operation?: InvestmentOperation | null;
  instrument?: InvestmentInstrument | InvestmentInstrumentSummary;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteOperationModal = ({
  operation,
  instrument,
  isOpen,
  onClose,
}: DeleteOperationModalProps) => {
  const { t } = useTranslation('investments');
  const { t: tCommon } = useTranslation('common');
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteOperation(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['operations'] });
      void queryClient.invalidateQueries({ queryKey: ['instruments'] });
      void queryClient.invalidateQueries({ queryKey: ['investments-summary'] });
      pushToast({
        variant: 'success',
        title:
          operation?.kind === 'snapshot'
            ? t('toasts.snapshotDeletedTitle')
            : t('toasts.operationDeletedTitle'),
      });
      onClose();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      const errorMessage =
        apiError.code && t(`errors.${apiError.code}`, { defaultValue: '' })
          ? t(`errors.${apiError.code}`)
          : apiError.message;
      pushToast({
        variant: 'error',
        title:
          operation?.kind === 'snapshot'
            ? t('toasts.snapshotDeleteErrorTitle')
            : t('toasts.operationDeleteErrorTitle'),
        message: errorMessage,
      });
    },
  });

  if (!operation) return null;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(operation.id);
  };

  const formattedDate = new Date(operation.date).toLocaleDateString(language);
  const instrumentName = instrument?.name ?? t('unknownInstrument');
  const isSnapshot = operation.kind === 'snapshot';

  const modalTitle = isSnapshot
    ? t('modals.deleteSnapshotTitle')
    : t('modals.deleteOperationTitle');
  const modalPrompt = isSnapshot
    ? t('modals.deleteSnapshotPrompt', { instrumentName, date: formattedDate })
    : t('modals.deleteOperationPrompt', {
        instrumentName,
        date: formattedDate,
        defaultValue: t('modals.deleteSnapshotPrompt', {
          instrumentName,
          date: formattedDate,
        }),
      });
  const modalHint = isSnapshot
    ? t('modals.deleteSnapshotHint')
    : t('modals.deleteOperationHint', {
        defaultValue: t('modals.deleteSnapshotHint'),
      });
  const confirmText = isSnapshot
    ? t('modals.deleteSnapshotConfirm')
    : t('modals.deleteOperationConfirm', {
        defaultValue: t('modals.deleteSnapshotConfirm'),
      });

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={modalTitle}>
      <div className="flex flex-col gap-4">
        <header className="flex items-start gap-3">
          <div className="rounded-full bg-destructive/10 p-2 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {modalPrompt}
            </h2>
            <p className="text-sm text-text-muted break-words [overflow-wrap:anywhere]">
              {modalHint}
            </p>
          </div>
        </header>

        <div className="mt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? tCommon('deleting') : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
