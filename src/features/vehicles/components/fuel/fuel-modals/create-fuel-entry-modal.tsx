import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFuelEntry,
  type CreateFuelEntryPayload,
  type VehicleFuelEntry,
} from '@vehicles/api';
import { VehicleModalShell } from '@vehicles/components/common';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { FuelEntryFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
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
    <VehicleModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={t('fuelPage.modals.createTitle')}
      description={t('fuelPage.modals.createDescription', { name: vehicleName })}
      testId="create-fuel-modal"
    >
      <FuelForm
        mode="create"
        isPending={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </VehicleModalShell>
  );
};
