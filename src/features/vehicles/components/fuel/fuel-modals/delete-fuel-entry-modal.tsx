import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFuelEntry } from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { VehicleFuelEntryEnriched } from '@vehicles/types';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Button, Modal } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

export type DeleteFuelEntryModalProps = {
  vehicleId: string;
  entry: VehicleFuelEntryEnriched | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const DeleteFuelEntryModal = ({
  vehicleId,
  entry,
  isOpen,
  onClose,
  onSuccess,
}: DeleteFuelEntryModalProps) => {
  const { t } = useTranslation('vehicles');
  const { t: tCommon } = useTranslation('common');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!entry) throw new Error('No entry selected');
      return await deleteFuelEntry(vehicleId, entry.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('fuelPage.toasts.deletedTitle'),
      });
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('fuelPage.toasts.deleteErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!entry) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('fuelPage.modals.deleteTitle')}>
      <div className="flex flex-col gap-4" data-testid="delete-fuel-modal">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t('fuelPage.modals.deleteTitle')}
          </h2>
        </header>

        <p className="text-sm text-fg">{t('fuelPage.modals.deletePrompt')}</p>
        <p className="text-xs text-text-muted">{t('fuelPage.modals.deleteHint')}</p>

        <div className="flex items-center justify-end gap-2 border-t border-card-border/40 pt-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            {tCommon('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => void deleteMutation.mutateAsync()}
            disabled={deleteMutation.isPending}
            data-testid="confirm-delete-fuel-button"
          >
            {deleteMutation.isPending
              ? tCommon('loading')
              : t('fuelPage.modals.deleteConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
