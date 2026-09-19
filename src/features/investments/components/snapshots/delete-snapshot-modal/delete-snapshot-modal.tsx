import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  deleteOperation,
  type InvestmentInstrument,
  type InvestmentInstrumentSummary,
  type InvestmentSnapshotOperation,
} from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useLanguage } from '@shared/hooks';
import { useToastStore } from '@shared/store/toast-store';
import { Button, Modal } from '@shared/ui';

type DeleteSnapshotModalProps = {
  snapshot: InvestmentSnapshotOperation | null;
  instrument?: InvestmentInstrument | InvestmentInstrumentSummary;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteSnapshotModal = ({
  snapshot,
  instrument,
  isOpen,
  onClose,
}: DeleteSnapshotModalProps) => {
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
        title: t('toasts.snapshotDeletedTitle'),
      });
      onClose();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.snapshotDeleteErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!snapshot) return null;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(snapshot.id);
  };

  const formattedDate = new Date(snapshot.date).toLocaleDateString(language);
  const instrumentName = instrument?.name ?? t('unknownInstrument');

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('modals.deleteSnapshotTitle')}>
      <div className="flex flex-col gap-4">
        <header className="flex items-start gap-3">
          <div className="rounded-full bg-destructive/10 p-2 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {t('modals.deleteSnapshotPrompt', {
                instrumentName,
                date: formattedDate,
              })}
            </h2>
            <p className="text-sm text-text-muted break-words [overflow-wrap:anywhere]">
              {t('modals.deleteSnapshotHint')}
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
            {deleteMutation.isPending
              ? tCommon('deleting')
              : t('modals.deleteSnapshotConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
