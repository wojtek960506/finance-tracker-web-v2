import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionDeletion } from '@transactions/api';

import { Detail } from '../../detail';

type TrashBadgeProps = {
  label?: string;
};

export const TrashBadge = ({ label }: TrashBadgeProps) => (
  <div
    className={
      'absolute right-4 top-4 rounded-full border border-destructive-border ' +
      'bg-destructive/10 p-2 text-destructive'
    }
  >
    <Trash2 className="size-7 sm:size-8" aria-label={label} />
  </div>
);

type TrashDetailsProps = {
  deletion: TransactionDeletion;
};

export const TrashDetails = ({ deletion }: TrashDetailsProps) => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();

  return (
    <>
      <Detail
        title={t('deletedAt')}
        titleClassName="text-transaction-expense-label"
        valueClassName="text-destructive"
      >
        <time>{new Date(deletion.deletedAt).toLocaleString(language)}</time>
      </Detail>
      <Detail
        title={t('purgeAt')}
        titleClassName="text-transaction-expense-label"
        valueClassName="text-destructive"
      >
        <time>{new Date(deletion.purgeAt).toLocaleString(language)}</time>
      </Detail>
    </>
  );
};
