import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFuelEntry, type VehicleFuelEntryEnriched } from '@vehicles/api';
import { DeleteVehicleRecordModal } from '@vehicles/components/common';
import { vehiclesQueryKeys } from '@vehicles/consts';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

export type DeleteFuelEntryModalProps = {
  vehicleId: string;
  entry: VehicleFuelEntryEnriched | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const DeleteFuelEntryModal = ({
  vehicleId,
  entry,
  isOpen,
  onClose,
  onSuccess,
}: DeleteFuelEntryModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!entry) throw new Error('No entry selected');
      return await deleteFuelEntry(vehicleId, entry.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('fuelPage.toasts.deletedTitle'),
      });
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('fuelPage.toasts.deleteErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!entry) return null;

  return (
    <DeleteVehicleRecordModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => deleteMutation.mutateAsync()}
      isPending={deleteMutation.isPending}
      title={t('fuelPage.modals.deleteTitle')}
      prompt={t('fuelPage.modals.deletePrompt')}
      hint={t('fuelPage.modals.deleteHint')}
      confirmLabel={t('fuelPage.modals.deleteConfirm')}
      testIdPrefix="fuel"
    />
  );
};
