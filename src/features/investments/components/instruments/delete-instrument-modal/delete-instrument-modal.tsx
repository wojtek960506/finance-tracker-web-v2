import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { deleteInstrument, type InvestmentInstrument } from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@shared/store/toast-store';
import { Button, Modal } from '@shared/ui';

type DeleteInstrumentModalProps = {
  instrument: InvestmentInstrument | null;
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteInstrumentModal = ({
  instrument,
  isOpen,
  onClose,
}: DeleteInstrumentModalProps) => {
  const { t } = useTranslation('investments');
  const { t: tCommon } = useTranslation('common');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteInstrument(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['instruments'] });
      void queryClient.invalidateQueries({ queryKey: ['operations'] });
      pushToast({
        variant: 'success',
        title: t('toasts.deletedTitle', {
          name: instrument?.name,
        }),
      });
      onClose();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.deleteErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!instrument) return null;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(instrument.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('modals.deleteTitle')}>
      <div className="flex flex-col gap-4">
        <header className="flex items-start gap-3">
          <div className="rounded-full bg-destructive/10 p-2 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {t('modals.deleteTitle')}
            </h2>
            <p className="text-sm text-text-muted break-words [overflow-wrap:anywhere]">
              {t('modals.deletePrompt', {
                name: instrument.name,
              })}
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
            {deleteMutation.isPending ? tCommon('deleting') : t('modals.deleteConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
