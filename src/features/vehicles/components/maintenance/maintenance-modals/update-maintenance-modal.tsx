import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateMaintenance,
  type UpdateMaintenancePayload,
  type VehicleMaintenance,
} from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { MaintenanceFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { ModalShell } from '@shared/ui';
import { useToastStore } from '@store/toast-store';

import { MaintenanceForm } from './maintenance-form';

export type UpdateMaintenanceModalProps = {
  vehicleId: string;
  item: VehicleMaintenance | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (item: VehicleMaintenance) => void;
};

export const UpdateMaintenanceModal = ({
  vehicleId,
  item,
  isOpen,
  onClose,
  onSuccess,
}: UpdateMaintenanceModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateMaintenancePayload) => {
      if (!item) throw new Error('No item selected');
      return await updateMaintenance(vehicleId, item.id, payload);
    },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('maintenancePage.toasts.updatedTitle'),
      });
      onClose();
      onSuccess?.(updated);
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('maintenancePage.toasts.updateErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!item) return null;

  const handleSubmit = async (values: MaintenanceFormValues) => {
    const payload: UpdateMaintenancePayload = {
      section: values.section,
      date: values.date,
      costPln: values.costPln,
      odometerKm: typeof values.odometerKm === 'number' ? values.odometerKm : undefined,
      serviceProvider: values.serviceProvider || undefined,
      serviceAddress: values.serviceAddress || undefined,
      description: values.description || undefined,
      transactionId: values.transactionId,
    };
    await updateMutation.mutateAsync(payload);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={t('maintenancePage.modals.updateTitle')}
      description={t('maintenancePage.modals.updateDescription')}
      testId="update-maintenance-modal"
    >
      <MaintenanceForm
        mode="update"
        defaultValues={{
          section: item.section,
          date: item.date,
          costPln: item.costPln,
          odometerKm: item.odometerKm ?? null,
          serviceProvider: item.serviceProvider ?? '',
          serviceAddress: item.serviceAddress ?? '',
          description: item.description ?? '',
          transactionId: item.transactionId ?? null,
        }}
        isPending={updateMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </ModalShell>
  );
};
