import clsx from 'clsx';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/ui';

type FieldSectionProps = ComponentProps<'div'>;

export const FieldSection = ({ className, ...props }: FieldSectionProps) => (
  <div {...props} className={clsx('flex flex-col gap-2', className)} />
);

type FieldErrorProps = {
  message?: string;
};

export const FieldError = ({ message }: FieldErrorProps) =>
  message ? <span className="text-sm text-destructive">{message}</span> : null;

type TransactionFormActionsProps = {
  isPending: boolean;
  onCancel: () => void;
};

export const TransactionFormActions = ({
  isPending,
  onCancel,
}: TransactionFormActionsProps) => {
  const { t } = useTranslation('transactions');

  return (
    <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
      <Button type="button" variant="ghost" onClick={onCancel}>
        {t('cancel')}
      </Button>
      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? t('creatingTransaction') : t('saveTransaction')}
      </Button>
    </div>
  );
};
