import { deleteFuelEntry, type VehicleFuelEntryEnriched } from '@vehicles/api';
import { useDeleteVehicleRecordMutation } from '@vehicles/hooks';
import { useTranslation } from 'react-i18next';

import { DeleteRecordModal } from '@shared/ui';

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

  const deleteMutation = useDeleteVehicleRecordMutation({
    mutationFn: async () => {
      if (!entry) throw new Error('No entry selected');
      return await deleteFuelEntry(vehicleId, entry.id);
    },
    successTitle: t('fuelPage.toasts.deletedTitle'),
    errorTitle: t('fuelPage.toasts.deleteErrorTitle'),
    onClose,
    onSuccess,
  });

  if (!entry) return null;

  return (
    <DeleteRecordModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => deleteMutation.mutate()}
      isPending={deleteMutation.isPending}
      title={t('fuelPage.modals.deleteTitle')}
      prompt={t('fuelPage.modals.deletePrompt')}
      hint={t('fuelPage.modals.deleteHint')}
      confirmLabel={t('fuelPage.modals.deleteConfirm')}
      testIdPrefix="fuel"
    />
  );
};
