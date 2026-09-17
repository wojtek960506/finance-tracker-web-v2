import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  type InvestmentSnapshotOperation,
  updateSnapshotOperation,
  type UpdateSnapshotPayload,
} from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@shared/store/toast-store';
import { Modal } from '@shared/ui';

import {
  getSnapshotFormValuesFromEntity,
  SnapshotForm,
  type SnapshotFormValues,
} from '../snapshot-form';

type EditSnapshotModalProps = {
  snapshot: InvestmentSnapshotOperation | null;
  isOpen: boolean;
  onClose: () => void;
};

export const EditSnapshotModal = ({
  snapshot,
  isOpen,
  onClose,
}: EditSnapshotModalProps) => {
  const { t } = useTranslation('investments');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateSnapshotPayload) => {
      if (!snapshot) return;
      return await updateSnapshotOperation(snapshot.id, payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['operations'] });
      void queryClient.invalidateQueries({ queryKey: ['instruments'] });
      pushToast({
        variant: 'success',
        title: t('toasts.snapshotUpdatedTitle'),
      });
      onClose();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.snapshotUpdateErrorTitle'),
        message: apiError.message,
      });
    },
  });

  if (!snapshot) return null;

  const handleSubmit = async (values: SnapshotFormValues) => {
    const payload: UpdateSnapshotPayload = {
      instrumentId: values.instrumentId,
      amount: Number(values.amount),
      currency: values.currency,
      date: values.date,
      note: values.note ? values.note.trim() : undefined,
    };

    await updateMutation.mutateAsync(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('modals.updateSnapshotTitle')}>
      <div className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {t('modals.updateSnapshotTitle')}
          </h2>
          <p className="text-sm text-text-muted">
            {t('modals.updateSnapshotDescription')}
          </p>
        </header>

        <SnapshotForm
          defaultValues={getSnapshotFormValuesFromEntity(snapshot)}
          submitLabel={t('form.updateSnapshotSubmit')}
          isPending={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
