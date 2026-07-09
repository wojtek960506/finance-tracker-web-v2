import type { TransactionAccountStatisticsCurrency } from '@transactions/api';

import { TransactionAccountStatisticsAccountCard } from './transaction-account-statistics-account-card';

type TransactionAccountStatisticsAccountsGridProps = {
  accounts: TransactionAccountStatisticsCurrency['accounts'];
  currency: TransactionAccountStatisticsCurrency['currency'];
  baseCurrency: string;
};

export const TransactionAccountStatisticsAccountsGrid = ({
  accounts,
  currency,
  baseCurrency,
}: TransactionAccountStatisticsAccountsGridProps) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
    {accounts.map((account) => (
      <TransactionAccountStatisticsAccountCard
        key={account.accountId}
        account={account}
        currency={currency}
        baseCurrency={baseCurrency}
      />
    ))}
  </div>
);
