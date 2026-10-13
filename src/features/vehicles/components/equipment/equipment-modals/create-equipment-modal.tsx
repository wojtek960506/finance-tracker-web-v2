import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEquipment,
  type CreateEquipmentPayload,
  type VehicleEquipment,
} from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { EquipmentFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Modal } from '@shared/ui';
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('equipmentPage.modals.createTitle')}
    >
      <div className="flex flex-col gap-3" data-testid="create-equipment-modal">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold text-fg sm:text-lg">
            {t('equipmentPage.modals.createTitle')}
          </h2>
          <p className="text-xs text-text-muted">
            {t('equipmentPage.modals.createDescription', { name: vehicleName })}
          </p>
        </div>

        <EquipmentForm
          mode="create"
          isPending={createMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
