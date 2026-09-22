import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  type InvestmentOperation,
  type UpdateInvestmentOperationPayload,
  updateOperation,
} from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@shared/store/toast-store';
import { Modal } from '@shared/ui';

import {
  getOperationFormValuesFromEntity,
  OperationForm,
  type OperationFormValues,
} from '../operation-form';

export type EditOperationModalProps = {
  operation?: InvestmentOperation | null;
  isOpen: boolean;
  onClose: () => void;
};

export const EditOperationModal = ({
  operation,
  isOpen,
  onClose,
}: EditOperationModalProps) => {
  const { t } = useTranslation('investments');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateInvestmentOperationPayload) => {
      if (!operation) return;
      return await updateOperation(operation.id, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['operations'] });
      void queryClient.invalidateQueries({ queryKey: ['instruments'] });
      void queryClient.invalidateQueries({ queryKey: ['investments-summary'] });
      pushToast({
        variant: 'success',
        title:
          operation?.kind === 'snapshot'
            ? t('toasts.snapshotUpdatedTitle')
            : t('toasts.operationUpdatedTitle'),
      });
      onClose();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      const errorMessage =
        apiError.code && t(`errors.${apiError.code}`, { defaultValue: '' })
          ? t(`errors.${apiError.code}`)
          : apiError.message;
      pushToast({
        variant: 'error',
        title:
          operation?.kind === 'snapshot'
            ? t('toasts.snapshotUpdateErrorTitle')
            : t('toasts.operationUpdateErrorTitle'),
        message: errorMessage,
      });
    },
  });

  if (!operation) return null;

  const handleSubmit = async (values: OperationFormValues) => {
    const payload: UpdateInvestmentOperationPayload = {
      instrumentId: values.instrumentId,
      amount: Number(values.amount),
      currency: values.currency,
      date: values.date,
      note: values.note ? values.note.trim() : undefined,
    };

    await updateMutation.mutateAsync(payload);
  };

  const isSnapshot = operation.kind === 'snapshot';
  const modalTitle = isSnapshot
    ? t('modals.updateSnapshotTitle')
    : t('modals.updateOperationTitle');
  const modalDescription = isSnapshot
    ? t('modals.updateSnapshotDescription')
    : t('modals.updateOperationDescription');

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={modalTitle}>
      <div className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{modalTitle}</h2>
          <p className="text-sm text-text-muted">{modalDescription}</p>
        </header>

        <OperationForm
          defaultValues={getOperationFormValuesFromEntity(operation)}
          submitLabel={t('form.updateSubmit')}
          isPending={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
