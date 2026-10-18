import { useTranslation } from 'react-i18next';

import { ModalShell } from '@shared/ui';

import { useSportEntryMutations } from '../../hooks';
import type { SportEntryFormValues } from '../../schemas';
import { getCategoryDisplayName } from '../../utils';

import { SportActivityForm } from './sport-activity-form';
import type { CreateSportActivityModalProps } from './types';

export const CreateSportActivityModal = ({
  isOpen,
  onClose,
  categories,
  defaultCategoryId,
  onSuccess,
}: CreateSportActivityModalProps) => {
  const { t } = useTranslation('sports');
  const { createEntry, isCreating } = useSportEntryMutations();

  const selectedCategory = categories.find((c) => c.id === defaultCategoryId);
  const categoryName = selectedCategory
    ? getCategoryDisplayName(selectedCategory, t)
    : '';

  const handleSubmit = async (values: SportEntryFormValues) => {
    try {
      const created = await createEntry({
        categoryId: values.categoryId,
        date: values.date,
        itemName: values.itemName,
        costPln: values.costPln,
        description: null,
        transactionId: null,
      });
      onClose();
      onSuccess?.(created);
    } catch {
      // Error is caught and surfaced via useSportEntryMutations toast
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={t('modals.createTitle')}
      description={
        categoryName
          ? t('modals.createDescription', { category: categoryName })
          : undefined
      }
      testId="create-sport-activity-modal"
    >
      <SportActivityForm
        categories={categories}
        defaultValues={{ categoryId: defaultCategoryId }}
        mode="create"
        isPending={isCreating}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </ModalShell>
  );
};
