import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@shared/hooks';
import { getAccountStatistics } from '@transactions/api';
import { formatCurrencyAmount, getTransactionNamedResourceLabel } from '@transactions/utils';
import { Card, LoadingState } from '@ui';

const BALANCE_POSITIVE_CLASS = 'text-bt-primary';
const BALANCE_NEGATIVE_CLASS = 'text-destructive';

export const TransactionAccountStatistics = () => {
  const { t } = useTranslation('transactions');
  const { t: tNamedResources } = useTranslation('namedResources');
  const { language } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ['transaction-account-statistics'],
    queryFn: async () => await getAccountStatistics(),
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[70rem] flex-col overflow-hidden">
        <Card className="mt-2 gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-6 sm:mt-3 sm:p-8">
          <LoadingState
            title={t('loadingAccountStatistics')}
            description={t('loadingAccountStatisticsDescription')}
            className="py-4"
          />
        </Card>
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error.message}</p>;
  }

  if (!data || data.currencies.length === 0) {
    return (
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[70rem] flex-col overflow-hidden">
        <Card className="gap-4 rounded-3xl border-fg/20 bg-modal-bg/95 p-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold sm:text-2xl">{t('accountStatistics')}</h2>
            <p className="text-sm text-text-muted sm:text-base">
              {t('noAccountStatistics')}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[70rem] flex-col gap-4 overflow-y-auto sm:gap-6">
      <Card className="gap-2 rounded-3xl border-fg/20 bg-modal-bg/95 p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold sm:text-2xl">{t('accountStatistics')}</h2>
          <p className="text-sm text-text-muted sm:text-base">
            {t('accountStatisticsDescription')}
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        {data.currencies.map((currencyGroup) => (
          <section key={currencyGroup.currency} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0 sm:flex-row sm:items-start sm:justify-between pr-4">
              <h3 className="text-lg font-semibold sm:text-xl">{currencyGroup.currency}</h3>

              <div className="flex flex-wrap gap-4">
                <div className="rounded-full bg-bg py-1 text-sm font-semibold text-text">
                  {t('accounts', { count: currencyGroup.accounts.length })}
                </div>
                <div
                  className={clsx(
                    'rounded-full py-1 text-sm font-semibold',
                    currencyGroup.totalAmount < 0 ? BALANCE_NEGATIVE_CLASS : BALANCE_POSITIVE_CLASS,
                  )}
                >
                  <span>
                    {currencyGroup.totalAmount >= 0 && '+'}
                    {formatCurrencyAmount(
                      currencyGroup.totalAmount,
                      currencyGroup.currency,
                      language,
                    )}
                  </span>
                </div>
                <div className="rounded-full bg-bg py-1 text-sm font-semibold text-text">
                  {t('totalItems')}: {currencyGroup.totalItems}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {currencyGroup.accounts.map((account) => {
                const balanceClassName =
                  account.totalAmount < 0
                    ? BALANCE_NEGATIVE_CLASS
                    : BALANCE_POSITIVE_CLASS;
                const accountLabel = getTransactionNamedResourceLabel(
                  {
                    name: account.accountName,
                    type: account.accountType,
                  },
                  tNamedResources,
                );

                return (
                  <Card
                    key={account.accountId}
                    className="gap-3 rounded-2xl border-fg/15 bg-bg/55 p-4 shadow-none"
                  >
                    <div className="flex min-w-0 flex-col gap-2">
                      <h4 className="truncate text-lg font-semibold sm:text-xl">
                        {accountLabel}
                      </h4>
                      <div
                        className={clsx(
                          'flex flex-wrap items-baseline gap-2 text-lg font-semibold sm:text-xl',
                          balanceClassName,
                        )}
                      >
                        <span>
                          {account.totalAmount >= 0 && '+'}
                          {formatCurrencyAmount(account.totalAmount, currencyGroup.currency, language)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-sm text-text-muted">
                      <span>{t('transactionsCount')}</span>
                      <span className="font-semibold text-text">
                        {account.totalItems}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
