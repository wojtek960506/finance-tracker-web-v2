import clsx from 'clsx';
import {
  ArrowRightLeft,
  DollarSign,
  Euro,
  JapaneseYen,
  PoundSterling,
  Wallet,
} from 'lucide-react';
import type { ComponentProps, ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card } from '@shared/ui';

type TransactionTypeCardIconProps = {
  className?: string;
  'aria-hidden'?: boolean;
};

type TransactionTypeCard = {
  key: string;
  icon: ComponentType<TransactionTypeCardIconProps>;
};

const ExchangeCurrenciesIcon = ({
  className,
  'aria-hidden': ariaHidden,
}: Pick<ComponentProps<'span'>, 'className'> & { 'aria-hidden'?: boolean }) => (
  <span
    className={clsx(
      'grid size-5 shrink-0 grid-cols-2 grid-rows-2 place-items-center gap-4',
      className,
    )}
    aria-hidden={ariaHidden}
  >
    <DollarSign className="size-[1rem]" />
    <Euro className="size-[1rem]" />
    <PoundSterling className="size-[1rem]" />
    <JapaneseYen className="size-[1rem]" />
  </span>
);

const transactionTypeCards = [
  {
    key: 'standard',
    icon: Wallet,
  },
  {
    key: 'transfer',
    icon: ArrowRightLeft,
  },
  {
    key: 'exchange',
    icon: ExchangeCurrenciesIcon,
  },
] as const satisfies ReadonlyArray<TransactionTypeCard>;

export const CreateTransaction = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('transactions');

  return (
    <Card className="mx-auto w-full max-w-4xl gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold sm:text-xl">{t('chooseTransactionKind')}</h2>
        <p className="text-sm text-text-muted sm:text-base">
          {t('chooseTransactionKindDescription')}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {transactionTypeCards.map(({ key, icon: Icon }) => (
          <Button
            key={key}
            type="button"
            variant="outline"
            className="h-full min-h-32 items-start rounded-2xl border border-fg bg-bg px-4 py-4 text-left"
            onClick={() => navigate(`/transactions/new/${key}`)}
          >
            <span className="flex w-full flex-col gap-3">
              <span className="flex items-center gap-3 sm:flex-col sm:items-start">
                <span className="rounded-xl border border-fg/20 bg-card-bg p-3 text-text-muted">
                  <Icon className="size-5" aria-hidden />
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
  );
};
