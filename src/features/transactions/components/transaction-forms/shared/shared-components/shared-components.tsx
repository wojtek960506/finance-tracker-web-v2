import clsx from 'clsx';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

export const FORM_BUTTON_CLASS_NAME = 'h-10 sm:h-11 rounded-xl px-3 sm:px-4 text-base sm:text-lg';

type FieldSectionProps = ComponentProps<'div'>;

export const FieldSection = ({ className, ...props }: FieldSectionProps) => (
  <div {...props} className={clsx('flex flex-col gap-1 sm:gap-2', className)} />
);

type FieldErrorProps = {
  message?: string;
};

export const FieldError = ({ message }: FieldErrorProps) =>
  message ? <span className="text-sm text-destructive">{message}</span> : null;

type TransactionFormActionsProps = {
  isPending: boolean;
  mode: 'create' | 'update';
  onCancel: () => void;
};

export const TransactionFormActions = ({
  isPending,
  mode,
  onCancel,
}: TransactionFormActionsProps) => {
  const { t } = useTranslation('transactions');
  const submitLabel = mode === 'create' ? t('saveTransaction') : t('updateTransaction');
  const pendingLabel =
    mode === 'create' ? t('creatingTransaction') : t('updatingTransaction');

  return (
    <div className="flex flex-col gap-2 sm:gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="ghost"
        className={FORM_BUTTON_CLASS_NAME}
        onClick={onCancel}
      >
        {t('cancel')}
      </Button>
      <Button
        type="submit"
        variant="primary"
        className={FORM_BUTTON_CLASS_NAME}
        disabled={isPending}
      >
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </div>
  );
};
