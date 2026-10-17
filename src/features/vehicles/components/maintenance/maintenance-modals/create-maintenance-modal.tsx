import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMaintenance,
  type CreateMaintenancePayload,
  type MaintenanceSection,
  type VehicleMaintenance,
} from '@vehicles/api';
import { VehicleModalShell } from '@vehicles/components/common';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { MaintenanceFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@store/toast-store';

import { MaintenanceForm } from './maintenance-form';

export type CreateMaintenanceModalProps = {
  vehicleId: string;
  vehicleName: string;
  section?: MaintenanceSection;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (item: VehicleMaintenance) => void;
};

export const CreateMaintenanceModal = ({
  vehicleId,
  vehicleName,
  section = 'ownMaintenance',
  isOpen,
  onClose,
  onSuccess,
}: CreateMaintenanceModalProps) => {
  const { t } = useTranslation('vehicles');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateMaintenancePayload) =>
      await createMaintenance(vehicleId, payload),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: vehiclesQueryKeys.all });
      pushToast({
        variant: 'success',
        title: t('maintenancePage.toasts.createdTitle'),
      });
      onClose();
      onSuccess?.(created);
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('maintenancePage.toasts.createErrorTitle'),
        message: apiError.message,
      });
    },
  });

  const handleSubmit = async (values: MaintenanceFormValues) => {
    const payload: CreateMaintenancePayload = {
      section: values.section,
      date: values.date,
      costPln: values.costPln,
      ...(typeof values.odometerKm === 'number' ? { odometerKm: values.odometerKm } : {}),
      ...(values.serviceProvider ? { serviceProvider: values.serviceProvider } : {}),
      ...(values.serviceAddress ? { serviceAddress: values.serviceAddress } : {}),
      ...(values.description ? { description: values.description } : {}),
      ...(values.transactionId ? { transactionId: values.transactionId } : {}),
    };
    await createMutation.mutateAsync(payload);
  };

  const isPreviousOwner = section === 'previousOwnerServices';
  const title = isPreviousOwner
    ? t('maintenancePage.modals.createPreviousOwnerTitle')
    : t('maintenancePage.modals.createTitle');
  const description = isPreviousOwner
    ? t('maintenancePage.modals.createPreviousOwnerDescription', { name: vehicleName })
    : t('maintenancePage.modals.createDescription', { name: vehicleName });

  return (
    <VehicleModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      testId="create-maintenance-modal"
    >
      <MaintenanceForm
        mode="create"
        fixedSection={section}
        isPending={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </VehicleModalShell>
  );
};
