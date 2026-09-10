import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  createInstrument,
  type CreateInstrumentPayload,
} from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@shared/store/toast-store';
import { Modal } from '@shared/ui';

import {
  getDefaultInstrumentFormValues,
  InstrumentForm,
  type InstrumentFormValues,
} from '../instrument-form';

type CreateInstrumentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (createdInstrumentId: string) => void;
};

export const CreateInstrumentModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateInstrumentModalProps) => {
  const { t } = useTranslation('investments');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateInstrumentPayload) =>
      await createInstrument(payload),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: ['instruments'] });
      pushToast({
        variant: 'success',
        title: t('toasts.createdTitle', {
          defaultValue: 'Instrument created',
          name: created.name,
        }),
      });
      onClose();
      onSuccess?.(created.id);
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.createErrorTitle', {
          defaultValue: 'Could not create instrument',
        }),
        message: apiError.message,
      });
    },
  });

  const handleSubmit = async (values: InstrumentFormValues) => {
    const payload: CreateInstrumentPayload = {
      name: values.name.trim(),
      kind: values.kind,
      currency: values.currency ? values.currency : undefined,
      notes: values.notes ? values.notes.trim() : undefined,
    };

    await createMutation.mutateAsync(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('modals.createTitle', {
        defaultValue: 'Create Investment Instrument',
      })}
    >
      <div className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {t('modals.createTitle', { defaultValue: 'New Instrument' })}
          </h2>
          <p className="text-sm text-text-muted">
            {t('modals.createDescription', {
              defaultValue:
                'Add a new stock, ETF, fund, or custom asset to your portfolio.',
            })}
          </p>
        </header>

        <InstrumentForm
          defaultValues={getDefaultInstrumentFormValues()}
          isPending={createMutation.isPending}
          mode="create"
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
