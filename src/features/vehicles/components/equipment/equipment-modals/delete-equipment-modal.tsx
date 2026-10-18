import { deleteEquipment, type VehicleEquipment } from '@vehicles/api';
import { useDeleteVehicleRecordMutation } from '@vehicles/hooks';
import { useTranslation } from 'react-i18next';

import { DeleteRecordModal } from '@shared/ui';

export type DeleteEquipmentModalProps = {
  vehicleId: string;
  item: VehicleEquipment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const DeleteEquipmentModal = ({
  vehicleId,
  item,
  isOpen,
  onClose,
  onSuccess,
}: DeleteEquipmentModalProps) => {
  const { t } = useTranslation('vehicles');

  const deleteMutation = useDeleteVehicleRecordMutation({
    mutationFn: async () => {
      if (!item) throw new Error('No item selected');
      return await deleteEquipment(vehicleId, item.id);
    },
    successTitle: t('equipmentPage.toasts.deletedTitle'),
    errorTitle: t('equipmentPage.toasts.deleteErrorTitle'),
    onClose,
    onSuccess,
  });

  if (!item) return null;

  return (
    <DeleteRecordModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => deleteMutation.mutate()}
      isPending={deleteMutation.isPending}
      title={t('equipmentPage.modals.deleteTitle')}
      prompt={t('equipmentPage.modals.deletePrompt')}
      hint={t('equipmentPage.modals.deleteHint')}
      confirmLabel={t('equipmentPage.modals.deleteConfirm')}
      testIdPrefix="equipment"
    >
      <div className="rounded-xl border border-border bg-card-bg p-3 text-xs">
        <p className="font-semibold text-fg">{item.itemName}</p>
        {item.description && <p className="mt-1 text-text-muted">{item.description}</p>}
      </div>
    </DeleteRecordModal>
  );
};
