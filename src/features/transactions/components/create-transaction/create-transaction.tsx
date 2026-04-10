import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card } from '@shared/ui';
import { TransactionKindIcon } from '@transactions/components/shared';

const transactionTypeCards = [
  {
    key: 'standard',
  },
  {
    key: 'transfer',
  },
  {
    key: 'exchange',
  },
] as const;

export const CreateTransaction = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('transactions');

  return (
    <div className="mx-auto flex max-w-150 max-w-4xl flex-col gap-2 sm:gap-3">
      <Button
        variant="ghost"
        className="w-fit gap-2 self-start px-0 py-0 text-sm sm:px-0 sm:py-0 sm:text-base"
        onClick={() => navigate('/transactions')}
      >
        <ArrowLeft className="size-4 sm:size-5" aria-hidden="true" />
        {t('backToTransactions')}
      </Button>
      <Card className="gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold sm:text-xl">
            {t('chooseTransactionKind')}
          </h2>
          <p className="text-sm text-text-muted sm:text-base">
            {t('chooseTransactionKindDescription')}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {transactionTypeCards.map(({ key }) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              className=" items-start rounded-2xl border border-fg bg-bg p-3 sm:p-4 text-left"
              onClick={() => navigate(`/transactions/new/${key}`)}
            >
              <span className="flex w-full flex-col gap-3">
                <span className="flex items-center gap-3">
                  <span className="rounded-xl border border-fg/50 bg-card-bg p-2 text-text-muted">
                    <TransactionKindIcon
                      kind={key}
                      className='size-8'
                      aria-hidden
                    />
                  </span>
                  <span className="text-base font-semibold text-fg sm:text-lg">
                    {t(`${key}Transaction`)}
                  </span>
                </span>
                <span className="text-sm text-text-muted">
                  {t(`${key}TransactionDescription`)}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
