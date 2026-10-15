import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateFuelEntry,
  type UpdateFuelEntryPayload,
  type VehicleFuelEntryEnriched,
} from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { FuelEntryFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Modal } from '@shared/ui';
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
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('fuelPage.modals.updateTitle')}>
      <div className="flex flex-col gap-4" data-testid="update-fuel-modal">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t('fuelPage.modals.updateTitle')}
          </h2>
          <p className="text-sm text-text-muted">
            {t('fuelPage.modals.updateDescription')}
          </p>
        </header>

        <FuelForm
          mode="update"
          defaultValues={defaultValues}
          isPending={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
