import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  createSnapshotOperation,
  type CreateSnapshotPayload,
} from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@shared/store/toast-store';
import { Modal } from '@shared/ui';

import {
  getDefaultSnapshotFormValues,
  SnapshotForm,
  type SnapshotFormValues,
} from '../snapshot-form';

type CreateSnapshotModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultInstrumentId?: string;
  defaultCurrency?: string;
  isInstrumentDisabled?: boolean;
};

export const CreateSnapshotModal = ({
  isOpen,
  onClose,
  defaultInstrumentId,
  defaultCurrency,
  isInstrumentDisabled,
}: CreateSnapshotModalProps) => {
  const { t } = useTranslation('investments');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateSnapshotPayload) =>
      await createSnapshotOperation(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['operations'] });
      void queryClient.invalidateQueries({ queryKey: ['instruments'] });
      pushToast({
        variant: 'success',
        title: t('toasts.snapshotCreatedTitle'),
      });
      onClose();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.snapshotCreateErrorTitle'),
        message: apiError.message,
      });
    },
  });

  const handleSubmit = async (values: SnapshotFormValues) => {
    const payload: CreateSnapshotPayload = {
      instrumentId: values.instrumentId,
      amount: Number(values.amount),
      currency: values.currency,
      date: values.date,
      note: values.note ? values.note.trim() : undefined,
    };

    await createMutation.mutateAsync(payload);
  };

  const shouldDisableInstrument = isInstrumentDisabled ?? Boolean(defaultInstrumentId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('modals.createSnapshotTitle')}>
      <div className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {t('modals.createSnapshotTitle')}
          </h2>
          <p className="text-sm text-text-muted">
            {t('modals.createSnapshotDescription')}
          </p>
        </header>

        <SnapshotForm
          defaultValues={getDefaultSnapshotFormValues(
            defaultInstrumentId,
            defaultCurrency,
          )}
          isPending={createMutation.isPending}
          isInstrumentDisabled={shouldDisableInstrument}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
