import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  type InvestmentInstrument,
  updateInstrument,
  type UpdateInstrumentPayload,
} from '@features/investments/api';
import { normalizeApiError } from '@shared/api/api-error';
import { useToastStore } from '@shared/store/toast-store';
import { Modal } from '@shared/ui';

import {
  getInstrumentFormValuesFromEntity,
  InstrumentForm,
  type InstrumentFormValues,
} from '../instrument-form';

type UpdateInstrumentModalProps = {
  instrument: InvestmentInstrument | null;
  isOpen: boolean;
  onClose: () => void;
};

export const UpdateInstrumentModal = ({
  instrument,
  isOpen,
  onClose,
}: UpdateInstrumentModalProps) => {
  const { t } = useTranslation('investments');
  const queryClient = useQueryClient();
  const pushToast = useToastStore((state) => state.pushToast);

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateInstrumentPayload;
    }) => await updateInstrument(id, payload),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ['instruments'] });
      pushToast({
        variant: 'success',
        title: t('toasts.updatedTitle', {
          defaultValue: 'Instrument updated',
          name: updated.name,
        }),
      });
      onClose();
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      pushToast({
        variant: 'error',
        title: t('toasts.updateErrorTitle', {
          defaultValue: 'Could not update instrument',
        }),
        message: apiError.message,
      });
    },
  });

  if (!instrument) return null;

  const handleSubmit = async (values: InstrumentFormValues) => {
    const payload: UpdateInstrumentPayload = {
      name: values.name.trim(),
      kind: values.kind,
      currency: values.currency ? values.currency : undefined,
      notes: values.notes ? values.notes.trim() : undefined,
    };

    await updateMutation.mutateAsync({ id: instrument.id, payload });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t('modals.updateTitle', {
        defaultValue: 'Update Investment Instrument',
      })}
    >
      <div className="flex flex-col gap-4">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {t('modals.updateTitle', { defaultValue: 'Edit Instrument' })}
          </h2>
          <p className="text-sm text-text-muted">
            {t('modals.updateDescription', {
              defaultValue: 'Update instrument name, kind, currency or notes.',
            })}
          </p>
        </header>

        <InstrumentForm
          defaultValues={getInstrumentFormValuesFromEntity(instrument)}
          isPending={updateMutation.isPending}
          mode="update"
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
};
