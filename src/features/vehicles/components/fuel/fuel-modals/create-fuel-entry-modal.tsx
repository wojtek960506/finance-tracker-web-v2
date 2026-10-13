import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFuelEntry,
  type CreateFuelEntryPayload,
  type VehicleFuelEntry,
} from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { FuelEntryFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Modal } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

import { FuelForm } from './fuel-form';

export type CreateFuelEntryModalProps = {
  vehicleId: string;
  vehicleName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (entry: VehicleFuelEntry) => void;
};

export const CreateFuelEntryModal = ({
  vehicleId,
  vehicleName,
  isOpen,
  onClose,
  onSuccess,
}: CreateFuelEntryModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateFuelEntryPayload) =>
      await createFuelEntry(vehicleId, payload),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('fuelPage.toasts.createdTitle'),
      });
      onClose();
      onSuccess?.(created);
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('fuelPage.toasts.createErrorTitle'),
        message: apiError.message,
      });
    },
  });

  const handleSubmit = async (values: FuelEntryFormValues) => {
    const payload: CreateFuelEntryPayload = {
      date: values.date,
      fuelLiters: values.fuelLiters,
      unitPricePln: values.unitPricePln,
      costPln: values.costPln,
      odometerKm: values.odometerKm,
      isFullTank: values.isFullTank,
      stationBrand: values.stationBrand?.trim() || undefined,
      stationAddress: values.stationAddress?.trim() || undefined,
      description: values.description?.trim() || undefined,
    };
    await createMutation.mutateAsync(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('fuelPage.modals.createTitle')}>
      <div className="flex flex-col gap-4" data-testid="create-fuel-modal">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t('fuelPage.modals.createTitle')}
          </h2>
          <p className="text-sm text-text-muted">
            {t('fuelPage.modals.createDescription', { name: vehicleName })}
          </p>
        </header>

        <FuelForm
          mode="create"
          isPending={createMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
