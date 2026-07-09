import type { TransactionAccountStatisticsCurrency } from '@transactions/api';
import {
  CurrencyCollapsibleCard,
  CurrencyCollapsibleCardHeader,
} from '@transactions/components/shared';

import { TransactionAccountStatisticsAccountsGrid } from './transaction-account-statistics-accounts-grid';
import { TransactionAccountStatisticsCurrencyGroupBadges } from './transaction-account-statistics-currency-group-badges';

const BALANCE_POSITIVE_CLASS = 'text-bt-primary';
const BALANCE_NEGATIVE_CLASS = 'text-destructive';

type TransactionAccountStatisticsCurrencyGroupProps = {
  currencyGroup: TransactionAccountStatisticsCurrency;
  baseCurrency: string;
};

export const TransactionAccountStatisticsCurrencyGroup = ({
  currencyGroup,
  baseCurrency,
}: TransactionAccountStatisticsCurrencyGroupProps) => {
  return (
    <section className="flex flex-col gap-3">
      <CurrencyCollapsibleCard
        header={
          <CurrencyCollapsibleCardHeader
            currency={currencyGroup.currency}
            balance={currencyGroup.totalAmount}
            balanceCurrency={currencyGroup.currency}
            balanceClassName={
              currencyGroup.totalAmount < 0
                ? BALANCE_NEGATIVE_CLASS
                : BALANCE_POSITIVE_CLASS
            }
            rightContent={
              <TransactionAccountStatisticsCurrencyGroupBadges
                currencyGroup={currencyGroup}
                baseCurrency={baseCurrency}
              />
            }
          />
        }
        isInitiallyOpen
      >
        <TransactionAccountStatisticsAccountsGrid
          accounts={currencyGroup.accounts}
          currency={currencyGroup.currency}
          baseCurrency={baseCurrency}
        />
      </CurrencyCollapsibleCard>
    </section>
  );
};
