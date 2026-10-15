import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEquipment, type VehicleEquipment } from '@vehicles/api';
import { DeleteVehicleRecordModal } from '@vehicles/components/common';
import { vehiclesQueryKeys } from '@vehicles/consts';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
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
    <DeleteVehicleRecordModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => deleteMutation.mutateAsync()}
      isPending={deleteMutation.isPending}
      title={t('equipmentPage.modals.deleteTitle')}
      prompt={t('equipmentPage.modals.deletePrompt')}
      hint={t('equipmentPage.modals.deleteHint')}
      confirmLabel={t('equipmentPage.modals.deleteConfirm')}
      testIdPrefix="equipment"
    >
      <div className="rounded-xl border border-border bg-card-bg p-3 text-xs">
        <p className="font-semibold text-fg">{item.itemName}</p>
        {item.description && <p className="mt-1 text-text-muted">{item.description}</p>}
      </div>
    </DeleteVehicleRecordModal>
  );
};
