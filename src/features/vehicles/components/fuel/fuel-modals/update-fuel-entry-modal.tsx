import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateFuelEntry,
  type UpdateFuelEntryPayload,
  type VehicleFuelEntryEnriched,
} from '@vehicles/api';
import { VehicleModalShell } from '@vehicles/components/common';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { FuelEntryFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import { FuelForm } from './fuel-form';

export type UpdateFuelEntryModalProps = {
  vehicleId: string;
  entry: VehicleFuelEntryEnriched | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const UpdateFuelEntryModal = ({
  vehicleId,
  entry,
  isOpen,
  onClose,
  onSuccess,
}: UpdateFuelEntryModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateFuelEntryPayload) => {
      if (!entry) throw new Error('No entry selected');
      return await updateFuelEntry(vehicleId, entry.id, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('fuelPage.toasts.updatedTitle'),
      });
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('fuelPage.toasts.updateErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!entry) return null;

  const handleSubmit = async (values: FuelEntryFormValues) => {
    const payload: UpdateFuelEntryPayload = {
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
    await updateMutation.mutateAsync(payload);
  };

  const defaultValues: Partial<FuelEntryFormValues> = {
    date: entry.date.split('T')[0],
    fuelLiters: entry.fuelLiters,
    unitPricePln: entry.unitPricePln,
    costPln: entry.costPln,
    odometerKm: entry.odometerKm,
    isFullTank: entry.isFullTank,
    stationBrand: entry.stationBrand ?? '',
    stationAddress: entry.stationAddress ?? '',
    description: entry.description ?? '',
  };

  return (
    <VehicleModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={t('fuelPage.modals.updateTitle')}
      description={t('fuelPage.modals.updateDescription')}
      testId="update-fuel-modal"
    >
      <FuelForm
        mode="update"
        defaultValues={defaultValues}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </VehicleModalShell>
  );
};
