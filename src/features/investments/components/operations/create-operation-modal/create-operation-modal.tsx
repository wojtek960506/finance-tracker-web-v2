import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  type CreateInvestmentOperationPayload,
  createOperation,
  type StandaloneInvestmentOperationKind,
} from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@shared/store/toast-store';
import { Modal } from '@shared/ui';

import {
  getDefaultOperationFormValues,
  OperationForm,
  type OperationFormValues,
} from '../operation-form';

export type CreateOperationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultInstrumentId?: string;
  defaultCurrency?: string;
  defaultKind?: StandaloneInvestmentOperationKind;
  isInstrumentDisabled?: boolean;
};

export const CreateOperationModal = ({
  isOpen,
  onClose,
  defaultInstrumentId = '',
  defaultCurrency = '',
  defaultKind = 'snapshot',
  isInstrumentDisabled = false,
}: CreateOperationModalProps) => {
  const { t } = useTranslation('investments');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateInvestmentOperationPayload) =>
      await createOperation(payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['operations'] });
      void queryClient.invalidateQueries({ queryKey: ['instruments'] });
      void queryClient.invalidateQueries({ queryKey: ['investments-summary'] });
      pushToast({
        variant: 'success',
        title:
          variables.kind === 'snapshot'
            ? t('toasts.snapshotCreatedTitle')
            : t('toasts.operationCreatedTitle'),
      });
      onClose();
    },
    onError: (error, variables) => {
      const apiError = normalizeApiError(error);
      const errorMessage =
        apiError.code && t(`errors.${apiError.code}`, { defaultValue: '' })
          ? t(`errors.${apiError.code}`)
          : apiError.message;
      pushToast({
        variant: 'error',
        title:
          variables.kind === 'snapshot'
            ? t('toasts.snapshotCreateErrorTitle')
            : t('toasts.operationCreateErrorTitle'),
        message: errorMessage,
      });
    },
  });

  const handleSubmit = async (values: OperationFormValues) => {
    const payload: CreateInvestmentOperationPayload = {
      instrumentId: values.instrumentId,
      kind: values.kind,
      amount: Number(values.amount),
      currency: values.currency,
      date: values.date,
      note: values.note ? values.note.trim() : undefined,
    };

    await createMutation.mutateAsync(payload);
  };

  const isSnapshot = defaultKind === 'snapshot';
  const modalTitle = isSnapshot
    ? t('modals.createSnapshotTitle')
    : t('modals.createOperationTitle');
  const modalDescription = isSnapshot
    ? t('modals.createSnapshotDescription')
    : t('modals.createOperationDescription');

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={modalTitle}>
      <div className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{modalTitle}</h2>
          <p className="text-sm text-text-muted">{modalDescription}</p>
        </header>

        <OperationForm
          defaultValues={getDefaultOperationFormValues(
            defaultInstrumentId,
            defaultCurrency,
            defaultKind,
          )}
          isPending={createMutation.isPending}
          isInstrumentDisabled={isInstrumentDisabled}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
