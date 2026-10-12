import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateVehiclePayload, Vehicle } from '@vehicles/api';
import { updateVehicle } from '@vehicles/api';
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

type UpdateVehicleModalProps = {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedVehicle: Vehicle) => void;
};

export const UpdateVehicleModal = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}: UpdateVehicleModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateVehiclePayload) => {
      if (!vehicle?.id) throw new Error('Missing vehicle ID');
      return await updateVehicle(vehicle.id, payload);
    },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('toasts.updatedTitle', {
          name: updated.name,
        }),
      });
      onClose();
      onSuccess?.(updated);
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.updateErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!vehicle) return null;

  const handleSubmit = async (values: VehicleFormValues) => {
    const payload: UpdateVehiclePayload = {
      name: values.name.trim(),
      type: values.type,
      slug: values.slug?.trim() || undefined,
      brand: values.brand?.trim() || undefined,
      vehicleModel: values.vehicleModel?.trim() || undefined,
      productionYear: values.productionYear ? Number(values.productionYear) : undefined,
      notes: values.notes?.trim() || undefined,
    };

    await updateMutation.mutateAsync(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('modals.updateTitle')}>
      <div className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t('modals.updateTitle')}
          </h2>
          <p className="text-sm text-text-muted">
            {t('modals.updateDescription', { name: vehicle.name })}
          </p>
        </header>

        <VehicleForm
          defaultValues={getDefaultVehicleFormValues(vehicle)}
          isPending={updateMutation.isPending}
          mode="update"
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
