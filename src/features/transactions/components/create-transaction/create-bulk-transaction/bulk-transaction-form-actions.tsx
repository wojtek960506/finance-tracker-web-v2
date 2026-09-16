import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';
import { FORM_BUTTON_CLASS_NAME } from '@transactions/components/transaction-forms';

type BulkTransactionFormActionsProps = {
  onAddRow: () => void;
  onDuplicateLastRow: () => void;
  onCancel: () => void;
  isPending: boolean;
  isSubmitDisabled: boolean;
  cancelButtonRef: RefObject<HTMLButtonElement | null>;
};

export const BulkTransactionFormActions = ({
  onAddRow,
  onDuplicateLastRow,
  onCancel,
  isPending,
  isSubmitDisabled,
  cancelButtonRef,
}: BulkTransactionFormActionsProps) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <Button
        type="button"
        variant="inverse"
        className={FORM_BUTTON_CLASS_NAME}
        onClick={onAddRow}
      >
        {t('addTransactionRow')}
      </Button>
      <Button
        type="button"
        variant="inverse"
        className={FORM_BUTTON_CLASS_NAME}
        onClick={onDuplicateLastRow}
      >
        {t('duplicateLastRow')}
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className={FORM_BUTTON_CLASS_NAME}
          ref={cancelButtonRef}
          onClick={onCancel}
        >
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          className={FORM_BUTTON_CLASS_NAME}
          disabled={isSubmitDisabled}
        >
          {isPending ? t('creatingTransactions') : t('createTransactions')}
        </Button>
      </div>
    </div>
  );
};
