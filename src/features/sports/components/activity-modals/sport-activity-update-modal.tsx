import { useTranslation } from 'react-i18next';

import { ModalShell } from '@shared/ui';

import { useSportEntryMutations } from '../../hooks';
import type { SportEntryFormValues } from '../../schemas';

import { SportActivityForm } from './sport-activity-form';
import type { UpdateSportActivityModalProps } from './types';

export const UpdateSportActivityModal = ({
  isOpen,
  onClose,
  categories,
  item,
  onSuccess,
}: UpdateSportActivityModalProps) => {
  const { t } = useTranslation('sports');
  const { updateEntry, isUpdating } = useSportEntryMutations();

  if (!item) {
    return null;
  }

  const handleSubmit = async (values: SportEntryFormValues) => {
    try {
      const updated = await updateEntry({
        id: item.id,
        data: {
          categoryId: values.categoryId,
          date: values.date,
          itemName: values.itemName,
          costPln: values.costPln,
          description: values.description,
          transactionId: values.transactionId,
        },
      });
      onClose();
      onSuccess?.(updated);
    } catch {
      // Error handled via useSportEntryMutations toast
    }
  };

  const defaultValues: Partial<SportEntryFormValues> = {
    categoryId: item.categoryId,
    date: item.date ? item.date.split('T')[0] : '',
    itemName: item.itemName,
    costPln: item.costPln,
    description: item.description ?? null,
    transactionId: item.transactionId ?? null,
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={t('modals.editTitle', { defaultValue: t('entries.editEntry') })}
      description={t('modals.editDescription')}
      testId="update-sport-activity-modal"
    >
      <SportActivityForm
        categories={categories}
        defaultValues={defaultValues}
        mode="update"
        isPending={isUpdating}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </ModalShell>
  );
};
