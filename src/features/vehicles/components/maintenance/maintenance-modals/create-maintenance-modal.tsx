import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMaintenance,
  type CreateMaintenancePayload,
  type MaintenanceSection,
  type VehicleMaintenance,
} from '@vehicles/api';
import { vehiclesQueryKeys } from '@vehicles/consts';
import type { MaintenanceFormValues } from '@vehicles/schemas';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Modal } from '@shared/ui';
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
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={title}>
      <div className="flex flex-col gap-3" data-testid="create-maintenance-modal">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold text-fg sm:text-lg">{title}</h2>
          <p className="text-xs text-text-muted">{description}</p>
        </div>

        <MaintenanceForm
          mode="create"
          fixedSection={section}
          isPending={createMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
