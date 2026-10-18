import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormActions, Input, Label, ModalShell } from '@shared/ui';
import { preventImplicitFormSubmit } from '@shared/utils';

import type { SportCategory } from '../../api';
import { useSportCategoryMutations } from '../../hooks';
import {
  type SportCategoryFormInput,
  sportCategoryFormSchema,
  type SportCategoryFormValues,
} from '../../schemas';

export interface CreateSportCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (category: SportCategory) => void;
}

const REQUIRED_LABEL_CLASS_NAME =
  "after:ml-0.5 after:text-destructive after:content-['*']";
const FIELD_ERROR_CLASS_NAME = 'text-xs text-destructive';

export const CreateSportCategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateSportCategoryModalProps) => {
  const { t } = useTranslation('sports');
  const { createCategory, isCreating } = useSportCategoryMutations();

  const form = useForm<SportCategoryFormInput, unknown, SportCategoryFormValues>({
    resolver: zodResolver(sportCategoryFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const handleFormSubmit: SubmitHandler<SportCategoryFormValues> = async (values) => {
    try {
      const created = await createCategory({ name: values.name.trim() });
      reset();
      onClose();
      onSuccess?.(created);
    } catch {
      // Error handled by useSportCategoryMutations
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title={t('modals.createCategoryTitle')}
      description={t('modals.createCategoryDescription')}
      testId="create-sport-category-modal"
    >
      <form
        onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)}
        onKeyDown={preventImplicitFormSubmit}
        className="flex flex-col gap-3.5 sm:gap-4"
        data-testid="sport-category-form"
      >
        <div className="flex flex-col gap-1">
          <Label htmlFor="sport-category-name">
            <span className={REQUIRED_LABEL_CLASS_NAME}>{t('modals.categoryName')}</span>
          </Label>
          <Input
            id="sport-category-name"
            type="text"
            placeholder={t('modals.categoryNamePlaceholder')}
            data-testid="sport-category-name-input"
            autoFocus
            {...register('name')}
          />
          {errors.name && (
            <span className={FIELD_ERROR_CLASS_NAME}>
              {t('modals.errors.categoryNameRequired')}
            </span>
          )}
        </div>

        <FormActions
          isPending={isCreating}
          onCancel={handleClose}
          submitLabel={t('modals.submitCreateCategory')}
          submitTestId="sport-category-form-submit"
          cancelTestId="sport-category-form-cancel"
        />
      </form>
    </ModalShell>
  );
};
