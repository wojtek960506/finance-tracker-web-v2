import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEquipment } from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { VehicleEquipment } from '@vehicles/types';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Button, Modal } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

export type DeleteEquipmentModalProps = {
  vehicleId: string;
  item: VehicleEquipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const DeleteEquipmentModal = ({
  vehicleId,
  item,
  isOpen,
  onClose,
  onSuccess,
}: DeleteEquipmentModalProps) => {
  const { t } = useTranslation('vehicles');
  const { t: tCommon } = useTranslation('common');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!item) throw new Error('No item selected');
      return await deleteEquipment(vehicleId, item.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('equipmentPage.toasts.deletedTitle'),
      });
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('equipmentPage.toasts.deleteErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('equipmentPage.modals.deleteTitle')}
    >
      <div className="flex flex-col gap-4" data-testid="delete-equipment-modal">
        <header className="space-y-1">
          <h2 className="text-base font-bold text-fg sm:text-lg">
            {t('equipmentPage.modals.deleteTitle')}
          </h2>
          <p className="text-xs text-text-muted">
            {t('equipmentPage.modals.deletePrompt')}
          </p>
        </header>

        <div className="rounded-xl border border-border bg-card-bg p-3 text-xs">
          <p className="font-semibold text-fg">{item.itemName}</p>
          {item.description && <p className="mt-1 text-text-muted">{item.description}</p>}
        </div>

        <p className="text-xs text-destructive">{t('equipmentPage.modals.deleteHint')}</p>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            data-testid="cancel-delete-equipment-button"
          >
            {tCommon('cancel')}
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => void deleteMutation.mutateAsync()}
            disabled={deleteMutation.isPending}
            data-testid="confirm-delete-equipment-button"
          >
            {t('equipmentPage.modals.deleteConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
