import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Button } from '../button';

import type { FormActionsProps } from './types';

export const FormActions = ({
  isPending = false,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
  submitTestId = 'form-submit',
  cancelTestId = 'form-cancel',
  className,
}: FormActionsProps) => {
  const { t } = useTranslation('common');

  return (
    <div
      className={clsx(
        'mt-2 flex items-center justify-end gap-2',
        'border-t border-card-border/40 pt-3',
        className,
      )}
    >
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isPending}
        data-testid={cancelTestId}
      >
        {cancelLabel ?? t('cancel')}
      </Button>

      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
        data-testid={submitTestId}
      >
        {isPending ? (submittingLabel ?? t('saving')) : submitLabel}
      </Button>
    </div>
  );
};
