import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button } from '@shared/ui';
import { useTransactionsPageContext } from '@transactions/components/transactions-page/context';

export const NewTransactionButton = () => {
  const { t } = useTranslation('transactions');
  const { handleNavigateToNewTransaction } = useTransactionsPageContext();

  return (
    <Button
      variant="primary"
      className={clsx(FORM_BUTTON_SIZE_CLASS, 'gap-2 font-semibold sm:font-bold')}
      aria-label={t('newTransaction')}
      onClick={handleNavigateToNewTransaction}
    >
      <Plus className="size-4 sm:size-5" aria-hidden="true" />
      <span aria-hidden="true" className="hidden sm:inline">
        {t('newButtonShort')}
      </span>
    </Button>
  );
};
