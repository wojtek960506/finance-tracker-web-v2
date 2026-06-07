import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { TransactionKindIcon } from '@transactions/components/shared';

import type { TransactionCardType } from '../create-transaction';

import {
  getTransactionsReturnTo,
  getTransactionsRouteState,
} from '@/features/transactions/utils';
import { Button } from '@/shared/ui';

export const CreateTransactionCardButton = ({
  cardType,
}: {
  cardType: TransactionCardType;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('transactions');
  const returnTo = getTransactionsReturnTo(location.state);

  const { key } = cardType;

  return (
    <Button
      key={key}
      type="button"
      variant="outline"
      className={clsx(
        'items-start rounded-2xl border border-fg bg-bg p-3 sm:p-4 text-left',
      )}
      onClick={() =>
        navigate(`/transactions/new/${key}`, {
          state: getTransactionsRouteState(returnTo),
        })
      }
    >
      <span className="flex w-full flex-col gap-3">
        <span className="flex items-center gap-3">
          <span className="rounded-xl border border-fg/50 bg-card-bg p-2 text-text-muted">
            <TransactionKindIcon kind={key} className="size-8" aria-hidden />
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
  );
};
