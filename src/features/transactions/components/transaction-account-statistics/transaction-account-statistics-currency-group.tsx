import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionAccountStatisticsCurrency } from '@transactions/api';
import {
  CurrencyCollapsibleCard,
  CurrencyCollapsibleCardHeader,
} from '@transactions/components/shared';
import { formatCurrencyAmount } from '@transactions/utils';

import {
  TransactionAccountStatisticsAccountCard
} from './transaction-account-statistics-account-card';

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
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();
  const normalizedAmountClassName =
    currencyGroup.normalizedTotalAmount !== undefined &&
    currencyGroup.normalizedTotalAmount < 0
      ? BALANCE_NEGATIVE_CLASS
      : BALANCE_POSITIVE_CLASS;

  // TODO maybe extract accounts cards and right content to components
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
                {currencyGroup.normalizedTotalAmount !== undefined ? (
                  <div
                    className={clsx(
                      'rounded-full bg-bg px-3 py-1 text-sm font-semibold',
                      normalizedAmountClassName,
                    )}
                  >
                    {currencyGroup.normalizedTotalAmount >= 0 && '+'}
                    {formatCurrencyAmount(
                      currencyGroup.normalizedTotalAmount,
                      baseCurrency,
                      language,
                    )}
                  </div>
                ) : null}
                <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
                  {t('accounts', { count: currencyGroup.accounts.length })}
                </div>
                <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
                  {t('transactionsCountSummary', { count: currencyGroup.totalItems })}
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
              baseCurrency={baseCurrency}
            />
          ))}
        </div>
      </CurrencyCollapsibleCard>
    </section>
  );
};
