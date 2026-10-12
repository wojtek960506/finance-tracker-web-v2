import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateVehiclePayload, Vehicle } from '@vehicles/api';
import { createVehicle } from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Modal } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

import {
  getDefaultVehicleFormValues,
  VehicleForm,
  type VehicleFormValues,
} from '../vehicle-form';

type CreateVehicleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (createdVehicle: Vehicle) => void;
};

export const CreateVehicleModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateVehicleModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateVehiclePayload) => await createVehicle(payload),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('toasts.createdTitle', {
          name: created.name,
        }),
      });
      onClose();
      onSuccess?.(created);
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.createErrorTitle'),
        message: apiError.message,
      });
    },
  });

  const handleSubmit = async (values: VehicleFormValues) => {
    const payload: CreateVehiclePayload = {
      name: values.name.trim(),
      type: values.type,
      slug: values.slug?.trim() || undefined,
      brand: values.brand?.trim() || undefined,
      vehicleModel: values.vehicleModel?.trim() || undefined,
      productionYear: values.productionYear ? Number(values.productionYear) : undefined,
      notes: values.notes?.trim() || undefined,
    };

    await createMutation.mutateAsync(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('modals.createTitle')}>
      <div className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t('modals.createTitle')}
          </h2>
          <p className="text-sm text-text-muted">{t('modals.createDescription')}</p>
        </header>

        <VehicleForm
          defaultValues={getDefaultVehicleFormValues()}
          isPending={createMutation.isPending}
          mode="create"
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
