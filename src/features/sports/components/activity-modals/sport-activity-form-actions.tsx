import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

import type { SportActivityFormActionsProps } from './types';

export const SportActivityFormActions = ({
  isPending,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
  submitTestId = 'sport-activity-form-submit',
  cancelTestId = 'sport-activity-form-cancel',
  className,
}: SportActivityFormActionsProps) => {
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
