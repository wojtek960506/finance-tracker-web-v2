import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Vehicle } from '@vehicles/api';
import { deleteVehicle } from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Button, Modal } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

type DeleteVehicleModalProps = {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const DeleteVehicleModal = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}: DeleteVehicleModalProps) => {
  const { t } = useTranslation('vehicles');
  const { t: tCommon } = useTranslation('common');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteVehicle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('toasts.deletedTitle', {
          name: vehicle?.name,
        }),
      });
      onClose();
      onSuccess?.();
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

  if (!vehicle) return null;

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(vehicle.id);
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
              {t('modals.deletePrompt', {
                name: vehicle.name,
              })}
            </h2>
            <p className="text-sm text-text-muted break-words [overflow-wrap:anywhere]">
              {t('modals.deleteHint')}
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
