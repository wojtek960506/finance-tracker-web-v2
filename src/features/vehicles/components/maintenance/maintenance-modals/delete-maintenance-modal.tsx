import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMaintenance, type VehicleMaintenance } from '@vehicles/api';
import { DeleteVehicleRecordModal } from '@vehicles/components/common';
import { vehiclesQueryKeys } from '@vehicles/consts';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import { MaintenanceSectionBadge } from '../maintenance-table/maintenance-section-badge';

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
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!item) throw new Error('No item selected');
      return await deleteMaintenance(vehicleId, item.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('maintenancePage.toasts.deletedTitle'),
      });
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('maintenancePage.toasts.deleteErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!item) return null;

  return (
    <DeleteVehicleRecordModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => deleteMutation.mutateAsync()}
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
    </DeleteVehicleRecordModal>
  );
};
