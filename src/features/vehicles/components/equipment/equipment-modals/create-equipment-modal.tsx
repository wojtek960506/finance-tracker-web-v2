import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEquipment,
  type CreateEquipmentPayload,
  type VehicleEquipment,
} from '@vehicles/api';
import { VehicleModalShell } from '@vehicles/components/common';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { EquipmentFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import { EquipmentForm } from './equipment-form';

export type CreateEquipmentModalProps = {
  vehicleId: string;
  vehicleName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (item: VehicleEquipment) => void;
};

export const CreateEquipmentModal = ({
  vehicleId,
  vehicleName,
  isOpen,
  onClose,
  onSuccess,
}: CreateEquipmentModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateEquipmentPayload) =>
      await createEquipment(vehicleId, payload),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('equipmentPage.toasts.createdTitle'),
      });
      onClose();
      onSuccess?.(created);
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('equipmentPage.toasts.createErrorTitle'),
        message: apiError.message,
      });
    },
  });

  const handleSubmit = async (values: EquipmentFormValues) => {
    const payload: CreateEquipmentPayload = {
      date: values.date,
      itemName: values.itemName,
      costPln: values.costPln,
      ...(values.description ? { description: values.description } : {}),
      ...(values.transactionId ? { transactionId: values.transactionId } : {}),
    };
    await createMutation.mutateAsync(payload);
  };

  return (
    <VehicleModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={t('equipmentPage.modals.createTitle')}
      description={t('equipmentPage.modals.createDescription', { name: vehicleName })}
      testId="create-equipment-modal"
    >
      <EquipmentForm
        mode="create"
        isPending={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </VehicleModalShell>
  );
};
