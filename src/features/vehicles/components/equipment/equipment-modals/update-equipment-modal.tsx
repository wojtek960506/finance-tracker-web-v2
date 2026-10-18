import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateEquipment,
  type UpdateEquipmentPayload,
  type VehicleEquipment,
} from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { EquipmentFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { ModalShell } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

import { EquipmentForm } from './equipment-form';

export type UpdateEquipmentModalProps = {
  vehicleId: string;
  item: VehicleEquipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const UpdateEquipmentModal = ({
  vehicleId,
  item,
  isOpen,
  onClose,
  onSuccess,
}: UpdateEquipmentModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateEquipmentPayload) => {
      if (!item) throw new Error('No item selected');
      return await updateEquipment(vehicleId, item.id, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('equipmentPage.toasts.updatedTitle'),
      });
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('equipmentPage.toasts.updateErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!item) return null;

  const handleSubmit = async (values: EquipmentFormValues) => {
    const payload: UpdateEquipmentPayload = {
      date: values.date,
      itemName: values.itemName.trim(),
      costPln: values.costPln,
      description: values.description?.trim() || undefined,
      transactionId: values.transactionId ?? null,
    };
    await updateMutation.mutateAsync(payload);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={t('equipmentPage.modals.updateTitle')}
      description={t('equipmentPage.modals.updateDescription')}
      testId="update-equipment-modal"
    >
      <EquipmentForm
        mode="update"
        defaultValues={{
          date: item.date ? item.date.split('T')[0] : '',
          itemName: item.itemName,
          costPln: item.costPln,
          description: item.description ?? '',
          transactionId: item.transactionId,
        }}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </ModalShell>
  );
};
