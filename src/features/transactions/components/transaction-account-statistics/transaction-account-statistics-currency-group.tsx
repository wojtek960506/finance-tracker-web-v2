import { useTranslation } from 'react-i18next';

import type { TransactionAccountStatisticsCurrency } from '@transactions/api';
import {
  CurrencyCollapsibleCard,
  CurrencyCollapsibleCardHeader,
} from '@transactions/components/shared';

import {
  TransactionAccountStatisticsAccountCard
} from './transaction-account-statistics-account-card';

const BALANCE_POSITIVE_CLASS = 'text-bt-primary';
const BALANCE_NEGATIVE_CLASS = 'text-destructive';

type TransactionAccountStatisticsCurrencyGroupProps = {
  currencyGroup: TransactionAccountStatisticsCurrency;
};

export const TransactionAccountStatisticsCurrencyGroup = ({
  currencyGroup,
}: TransactionAccountStatisticsCurrencyGroupProps) => {
  const { t } = useTranslation('transactions');

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
              <>
                <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
                  {t('accounts', { count: currencyGroup.accounts.length })}
                </div>
                <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
                  {t('totalItems')}: {currencyGroup.totalItems}
                </div>
              </>
            }
          />
        }
        isInitiallyOpen
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
          {currencyGroup.accounts.map((account) => (
            <TransactionAccountStatisticsAccountCard
              key={account.accountId}
              account={account}
              currency={currencyGroup.currency}
            />
          ))}
        </div>
      </CurrencyCollapsibleCard>
    </section>
  );
};
