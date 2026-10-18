import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { normalizeApiError } from '@shared/api/api-error';
import { Button, Modal } from '@shared/ui';

import { useSportCategoryMutations } from '../../hooks';

import type { SportCategoryDeleteModalProps } from './types';

export const SportCategoryDeleteModal = ({
  category,
  isOpen,
  onClose,
}: SportCategoryDeleteModalProps) => {
  const { t } = useTranslation('sports');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { deleteCategory, isDeleting } = useSportCategoryMutations();

  if (!category) return null;

  const handleConfirm = async () => {
    setErrorMessage(null);
    try {
      await deleteCategory(category.id);
      onClose();
    } catch (err) {
      const apiErr = normalizeApiError(err);
      setErrorMessage(apiErr.message);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    onClose();
  };

  const modalTitle = errorMessage
    ? t('toasts.categoryDeleteError')
    : t('categories.deleteCategory');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel={modalTitle}>
      <div className="flex flex-col gap-4" data-testid="delete-sport-category-modal">
        <header className="space-y-1">
          <h2 className="text-base font-bold text-fg sm:text-lg">{modalTitle}</h2>
          <p className="text-sm text-text-muted">
            {errorMessage ?? t('categories.deleteConfirmation', { name: category.name })}
          </p>
        </header>

        {!errorMessage && (
          <p className="text-xs text-text-muted">{t('categories.deleteHint')}</p>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          {errorMessage ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleClose}
              data-testid="close-delete-sport-category-error-button"
            >
              {t('actions.close')}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isDeleting}
                data-testid="cancel-delete-sport-category-button"
              >
                {t('actions.cancel')}
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleConfirm()}
                disabled={isDeleting}
                data-testid="confirm-delete-sport-category-button"
              >
                {t('actions.delete')}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
