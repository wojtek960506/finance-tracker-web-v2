import { deleteMaintenance, type VehicleMaintenance } from '@vehicles/api';
import { useDeleteVehicleRecordMutation } from '@vehicles/hooks';
import { useTranslation } from 'react-i18next';

import { DeleteRecordModal } from '@shared/ui';

import { MaintenanceSectionBadge } from '../maintenance-section-badge';

export type DeleteMaintenanceModalProps = {
  vehicleId: string;
  item: VehicleMaintenance | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const DeleteMaintenanceModal = ({
  vehicleId,
  item,
  isOpen,
  onClose,
  onSuccess,
}: DeleteMaintenanceModalProps) => {
  const { t } = useTranslation('vehicles');

  const deleteMutation = useDeleteVehicleRecordMutation({
    mutationFn: async () => {
      if (!item) throw new Error('No item selected');
      return await deleteMaintenance(vehicleId, item.id);
    },
    successTitle: t('maintenancePage.toasts.deletedTitle'),
    errorTitle: t('maintenancePage.toasts.deleteErrorTitle'),
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
      title={t('maintenancePage.modals.deleteTitle')}
      prompt={t('maintenancePage.modals.deletePrompt')}
      hint={t('maintenancePage.modals.deleteHint')}
      confirmLabel={t('maintenancePage.modals.deleteConfirm')}
      testIdPrefix="maintenance"
    >
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card-bg p-3 text-xs">
        <div className="flex items-center gap-2">
          <MaintenanceSectionBadge section={item.section} />
          {item.serviceProvider && (
            <span className="font-semibold text-fg">• {item.serviceProvider}</span>
          )}
        </div>
        {item.description && <p className="text-text-muted">{item.description}</p>}
      </div>
    </DeleteRecordModal>
  );
};
