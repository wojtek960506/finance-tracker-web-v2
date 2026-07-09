import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type {
  TransactionAccountStatisticsAccount,
  TransactionAccountStatisticsCurrency,
} from '@transactions/api';
import {
  formatCurrencyAmount,
  getTransactionNamedResourceLabel,
} from '@transactions/utils';
import { Card } from '@ui';

import { AccountNamePopover } from './account-name-popover';

const BALANCE_POSITIVE_CLASS = 'text-bt-primary';
const BALANCE_NEGATIVE_CLASS = 'text-destructive';

type TransactionAccountStatisticsAccountCardProps = {
  account: TransactionAccountStatisticsAccount;
  currency: TransactionAccountStatisticsCurrency['currency'];
  baseCurrency: string;
};

export const TransactionAccountStatisticsAccountCard = ({
  account,
  currency,
  baseCurrency,
}: TransactionAccountStatisticsAccountCardProps) => {
  const { t } = useTranslation('transactions');
  const { t: tNamedResources } = useTranslation('namedResources');
  const { language } = useLanguage();

  const balanceClassName =
    account.totalAmount < 0 ? BALANCE_NEGATIVE_CLASS : BALANCE_POSITIVE_CLASS;
  const accountLabel = getTransactionNamedResourceLabel(
    {
      name: account.accountName,
      type: account.accountType,
    },
    tNamedResources,
  );

  return (
    <Card
      className="gap-3 rounded-2xl border-fg/15 bg-bg/65 p-4 shadow-none"
      data-testid={`transaction-account-statistics-account-${account.accountId}`}
    >
      <div className="flex min-w-0 flex-col gap-1 md:gap-2">
        <AccountNamePopover label={accountLabel} />
        <div
          className={clsx(
            'flex flex-wrap items-baseline gap-2 text-lg font-semibold sm:text-xl',
            balanceClassName,
          )}
        >
          <span>
            {account.totalAmount >= 0 && '+'}
            {formatCurrencyAmount(account.totalAmount, currency, language)}
          </span>
        </div>
        {account.normalizedTotalAmount !== undefined ? (
          <div
            className={clsx(
              'flex flex-wrap items-baseline gap-2 text-sm font-semibold',
              account.normalizedTotalAmount < 0
                ? BALANCE_NEGATIVE_CLASS
                : BALANCE_POSITIVE_CLASS,
            )}
          >
            <span>
              {account.normalizedTotalAmount >= 0 && '+'}
              {formatCurrencyAmount(
                account.normalizedTotalAmount,
                baseCurrency,
                language,
              )}
            </span>
          </div>
        ) : null}

        <div className="text-sm text-text-muted">
          <span>{t('transactionsCount')}: </span>
          <span className="font-semibold text-text">{account.totalItems}</span>
        </div>
      </div>
    </Card>
  );
};
