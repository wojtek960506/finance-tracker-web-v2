import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import type { TransactionAccountStatisticsCurrency } from '@transactions/api';
import { formatCurrencyAmount } from '@transactions/utils';
import { Card, Collapsible } from '@ui';

import { TransactionAccountStatisticsAccountCard } from './transaction-account-statistics-account-card';

const BALANCE_POSITIVE_CLASS = 'text-bt-primary';
const BALANCE_NEGATIVE_CLASS = 'text-destructive';

type TransactionAccountStatisticsCurrencyGroupProps = {
  currencyGroup: TransactionAccountStatisticsCurrency;
};

export const TransactionAccountStatisticsCurrencyGroup = ({
  currencyGroup,
}: TransactionAccountStatisticsCurrencyGroupProps) => {
  const { t } = useTranslation('transactions');
  const { language } = useLanguage();

  return (
    <section className="flex flex-col gap-3">
      <Card className={clsx(
        "currency-statistics-card-container gap-0 rounded-2xl border-fg/15 bg-bg/55",
        "p-0 shadow-none sm:p-0",
      )}>
        <Collapsible
          header={
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2 pl-1 ">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className={clsx(
                  "min-w-10 truncate text-left text-lg font-semibold sm:min-w-11 sm:text-xl"
                )}>
                  {currencyGroup.currency}
                </h3>
                <div
                  className={
                    currencyGroup.totalAmount < 0
                      ? BALANCE_NEGATIVE_CLASS
                      : BALANCE_POSITIVE_CLASS
                  }
                >
                  {currencyGroup.totalAmount >= 0 && '+'}
                  {formatCurrencyAmount(
                    currencyGroup.totalAmount,
                    currencyGroup.currency,
                    language,
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
                  {t('accounts', { count: currencyGroup.accounts.length })}
                </div>
                <div className="rounded-full bg-bg px-3 py-1 text-sm font-semibold text-text">
                  {t('totalItems')}: {currencyGroup.totalItems}
                </div>
              </div>
            </div>
          }
          indicatorPosition="left"
          isInitiallyOpen
          triggerMode="full-row"
          contentInset="none"
          triggerClassName="justify-between rounded-2xl border-0 p-3 sm:rounded-3xl sm:p-4"
          contentClassName="px-3 pb-3 sm:px-4 sm:pb-4"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {currencyGroup.accounts.map((account) => (
              <TransactionAccountStatisticsAccountCard
                key={account.accountId}
                account={account}
                currency={currencyGroup.currency}
              />
            ))}
          </div>
        </Collapsible>
      </Card>
    </section>
  );
};
