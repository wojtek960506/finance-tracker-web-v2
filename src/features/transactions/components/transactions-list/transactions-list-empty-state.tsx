import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { FORM_BUTTON_SIZE_CLASS } from '@shared/consts';
import { Button, Card } from '@shared/ui';
import { useTransactionsPageContext } from '@transactions/components/transactions-page/context';

export const TransactionsListEmptyState = () => {
  const { t } = useTranslation('transactions');
  const { handleNavigateToNewTransaction } = useTransactionsPageContext();

  return (
    <Card
      className={clsx(
        'mx-auto mt-2 w-full max-w-[35rem] items-center gap-4 rounded-3xl border-fg/20',
        'bg-modal-bg/95 p-6 text-center sm:mt-3 sm:p-8',
      )}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold sm:text-2xl">
          {t('emptyTransactionsTitle')}
        </h2>
        <p className="text-sm text-text-muted sm:text-base">
          {t('emptyTransactionsDescription')}
        </p>
      </div>

      <Button
        variant="primary"
        className={clsx(FORM_BUTTON_SIZE_CLASS, 'mt-2 sm:mt-3 w-full')}
        onClick={handleNavigateToNewTransaction}
      >
        {t('createFirstTransaction')}
      </Button>
    </Card>
  );
};
