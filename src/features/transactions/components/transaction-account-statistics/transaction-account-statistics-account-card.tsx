import { useTranslation } from 'react-i18next';

import type {
  TransactionAccountStatisticsAccount,
  TransactionAccountStatisticsCurrency,
} from '@transactions/api';
import { getTransactionNamedResourceLabel } from '@transactions/utils';
import { Card } from '@ui';

import { AccountNamePopover } from './account-name-popover';
import { TransactionAccountStatisticsAccountCardAmount } from './transaction-account-statistics-account-card-amount';
import { TransactionAccountStatisticsAccountCardItemsCount } from './transaction-account-statistics-account-card-items-count';

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
  const { t: tNamedResources } = useTranslation('namedResources');

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
        <TransactionAccountStatisticsAccountCardAmount
          amount={account.totalAmount}
          currency={currency}
        />
        <TransactionAccountStatisticsAccountCardAmount
          amount={account.normalizedTotalAmount}
          currency={baseCurrency}
          size="secondary"
        />
        <TransactionAccountStatisticsAccountCardItemsCount totalItems={account.totalItems} />
      </div>
    </Card>
  );
};
